export default {
  mounted () {
    this.initBem()
  },

  methods: {
    initBem () {
      if (typeof this.bem !== 'object' || this.bem === null) return

      ['modifiers', 'elements'].map(setter => {
        if (typeof this.bem[setter] === 'object' && this.bem[setter] !== null) {
          this['set' + setter[0].toUpperCase() + setter.substring(1)](this, this.$el, this.bem.name, this.bem[setter])
        }
      })
    },

    setElementsDescriptor (object, parent, block, elements) {
      for (var name in elements) {
        if (element.hasOwnProperty(name)) {
          object[name] = {}
          this.setElementModifiersDescriptor(object, name, parent, block, elements[name])
        }
      }
    },

    setElementModifiersDescriptor (object, name, parent, block, element) {
      this.setModifiersDescriptor(
        object[name],
        () => parent.querySelector('.' + this.elementString(block, name)),
        this.elementString(block, name),
        element,
        object._props
      )
    },

    elementString (block, name) {
      return block + '__' + name
    },

    setModifiersDescriptor (object, node, name, modifiers, override) {
      var prefix = name.split('__').slice(1).map(part => part[0].toUpperCase() + part.substring(1)).join('')
      var key, value
      override = Object.assign({}, override || object._props)

      Object.defineProperties(object, this.modifiersDescriptor(node, name, modifiers))

      for (var modifier in modifiers) {
        if (modifiers.hasOwnProperty(modifier)) {
          key = prefix + modifier[0].toUpperCase() + modifier.substring(1)
          key = key[0].toLowerCase() + key.substring(1)
          value = override[key]
          object[modifier] = value === undefined ? modifiers[modifier] : value
        }
      }
    },

    modifiersDescriptor  (node, name, modifiers) {
      var descriptor = {}

      for (var modifier in modifiers) {
        if (modifiers.hasOwnProperty(modifier)) {
          descriptor[modifier] = this.modifierDescriptor(node, name, modifier, modifiers[modifier])
        }
      }

      return descriptor
    },

    modifierDescriptor (node, name, modifier, base) {
      var type = this.modifierValueType(base)
      var method = type[0].toUpperCase() + type.substring(1) + 'Modifier'
      return {
        get: () => this['get' + method](node, name, modifier),
        set: value => this['set' + method](node, name, modifier, value)
      }
    },

    modifierValueType (value) {
      return [true, false].includes(value) ? 'boolean' : 'string'
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
      value = value === 'false' ? false : !!value

      if(node && this.getBooleanModifier(node, name, modifier) !== value) {
        if(value) node.className += ' '+this.booleanModifierString(name, modifier)
        else node.className = node.className.replace(this.booleanModifierPattern(name, modifier), '').trim()
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
      value = value + ''
      value = ['undefined', 'null', 'false'].includes(value) ? null : value

      if (node && this.getStringModifier(node, name, modifier) !== value) {
        node.className = node.className.replace(this.stringModifierPattern(name, modifier), '').trim()
        if (value) node.className += ' '+this.stringModifierString(name, modifier, value)
      }
    }
  }
}
