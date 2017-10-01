export default {
  mounted () {
    this.initBem()
  },

  methods: {
    initBem () {
      if (typeof this.bem !== 'object' || this.bem === null) return

      if (typeof this.bem.modifiers === 'object' && this.bem.modidifers !== null) {
        this.setModifiersDescriptor(this, this.$el, this.bem.name, this.bem.modifiers)
      }

      if (typeof this.bem.elements === 'object' && this.bem.elements !== null) {
        this.setElementsDescriptor(this, this.$el, this.bem.name, this.bem.elements)
      }
    },

    setElementsDescriptor (object, parent, block, elements) {
      var override = {}

      for (var property in object) {
        if (property.match(/^is[A-Z]/) !== null) {
          override[property.substring(2, 1).toLowerCase() + property.substring(4)] = object[property]
        }
      }

      for (var name in elements) {
        object[name] = {}
        this.setModifiersDescriptor(
          object[name],
          () => parent.querySelector('.' + this.elementString(block, name)),
          this.elementString(block, name),
          elements[name],
          override
        )
      }
    },

    elementString (block, name) {
      return block + '__' + name
    },

    setModifiersDescriptor (object, node, name, modifiers, override) {
      override = Object.assign({}, override || object)
      Object.defineProperties(object, this.modifiersDescriptor(node, name, modifiers, override))

      for(var modifier in modifiers) {
        object[modifier] = override[modifier] === undefined ? modifiers[modifier] : override[modifier]
      }
    },

    modifiersDescriptor  (node, name, modifiers, override) {
      var descriptor = {}

      for (var modifier in modifiers) {
        descriptor[modifier] = this.modifierDescriptor(node, name, modifier, modifiers[modifier])
      }

      return descriptor
    },

    modifierDescriptor (node, name, modifier, base) {
      if (this.modifierValueType(base) === 'boolean') {
        return this.booleanModifierDescriptor(node, name, modifier)
      } else {
        return this.stringModifierDescriptor(node, name, modifier)
      }
    },

    modifierValueType (value) {
      return [true, false].includes(value) ? 'boolean' : 'string'
    },

    booleanModifierDescriptor (node, name, modifier) {
      return {
        get: () => this.getBooleanModifier(node, modifier),
        set: value => this.setBooleanModifier(node, modifier, value)
      }
    },

    booleanModifierString (name, modifier) {
      return name + '--' + modifier
    },

    booleanModifierPattern (name, modifier) {
      return new RegExp('\\b' + this.booleanModifierString(name, modifier) + '\\b')
    },

    getBooleanModifier (node, name, modifier) {
      if (!node) return false
      if(typeof node === 'function') node = node()

      return node ? node.className.match(this.booleanModifierPattern(name, modifier)) !== null : false
    },

    setBooleanModifier (node, name, modifier, value) {
      if (!node) return
      if(typeof node === 'function') node = node()
      value = !!value

      if(node && this.getBooleanModifier(node, name, modifier) !== value) {
        if(value) node.className += ' '+this.booleanModifierString(name, modifier)
        else node.className = node.className.replace(this.booleanModifierPattern(name, modifier), '').trim()
      }
    },

    stringModifierDescriptor (node, name, modifier) {
      return {
        get: () => this.getStringModifier(node, modifier),
        set: value => this.setStringModifier(node, modifier, value)
      }
    },

    stringModifierString (name, modifier, value) {
      return name + '--' + modifier + '--' + value
    },

    stringModifierPattern (name, modifier) {
      return new RegExp('\\b' + this.stringModifierString(name, modifier, '([^\\s]+)') + '\\b')
    },

    getStringModifier (node, name, modifier) {
      if (!node) return null
      if(typeof node === 'function') node = node()

      return node ? (node.className.match(this.stringModifierPattern(name, modifier)) || [null, null])[1] : null
    },

    setStringModifier (node, name, modifier, value) {
      if (!node) return
      if(typeof node === 'function') node = node()

      if (node && this.getStringModifier(node, name, modifier) !== value) {
        node.className = node.className.replace(this.stringModifierPattern(name, modifier), '').trim()
        if (value) node.className += ' '+this.stringModifierString(name, modifier, value)
      }
    }
  }
}
