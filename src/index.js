export default {
  computed: {
    is () {
      return Object.create({}, this.modifiersDescriptor)
    },

    own () {
      return this.is
    },

    modifiersDescriptor () {
      var descriptor = {}
      for (var modifier in this.modifiers) descriptor[modifier] = this.modifierDescriptor(modifier)

      return descriptor
    }
  },

  created () {
    this.initModifiers()
  },

  methods: {
    initModifiers () {
      for(var modifier in this.modifiers) {
        this.setModifier(modifier, this[modifier] === undefined ? this.modifiers[modifier] : this[modifier])
      }
    },

    modifierDescriptor (modifier) {
      return {
        get: () => this.getModifier(modifier),
        set: value => this.setModifier(modifier, value)
      }
    },

    getModifier (modifier) {
      if(this.modifierType (modifier) === 'boolean') return this.getBooleanModifier(modifier)
      else return this.getStringModifier(modifier)
    },

    setModifier (modifier, value) {
      if(this.modifierType (modifier) === 'boolean') return this.setBooleanModifier(modifier, value)
      else return this.setStringModifier(modifier, value)
    },

    modifierType(modifier) {
      return this.modifierValueType(this.modifiers[modifier])
    },

    modifierValueType (value) {
      return [true, false].includes(value) ? 'boolean' : 'string'
    },

    booleanModifierString (modifier) {
      return this.name + '--' + modifier
    },

    booleanModifierPattern (modifier) {
      return new RegExp('\\b' + this.booleanModifierString(modifier) + '\\b')
    },

    getBooleanModifier (modifier) {
      if (!this.$el) return false
      return this.$el.className.match(this.booleanModifierPattern(modifier)) !== null
    },

    setBooleanModifier (modifier, value) {
      if (!this.$el) return

      value = !!value

      if(this.getBooleanModifier(modifier) !== value) {
        if(value) this.$el.className += ' '+this.booleanModifierString(modifier)
        else this.$el.className = this.$el.className.replace(this.booleanModifierPattern(modifier), '').trim()
      }
    },

    stringModifierString (modifier, value) {
      return this.name + '--' + modifier + '--' + value
    },

    stringModifierPattern (modifier) {
      return new RegExp('\\b' + this.stringModifierString(modifier, '([^\\s]+)'))
    },

    getStringModifier (modifier) {
      if (!this.$el) return null
      return (this.$el.className.match(this.stringModifierPattern(modifier)) || [null, null])[1]
    },

    setStringModifier (modifier, value) {
      if (!this.$el) return

      if (this.getStringModifier(modifier) !== value) {
        this.$el.className = this.$el.className.replace(this.stringModifierPattern(modifier), '').trim()
        if (value) this.$el.className += ' '+this.stringModifierString(modifier, value)
      }
    }
  }
}
