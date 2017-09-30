'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  computed: {
    is: function is() {
      return Object.create({}, this.modifiersDescriptor);
    },
    own: function own() {
      return this.is;
    },
    modifiersDescriptor: function modifiersDescriptor() {
      var descriptor = {};
      for (var modifier in this.modifiers) {
        descriptor[modifier] = this.modifierDescriptor(modifier);
      }return descriptor;
    }
  },

  created: function created() {
    this.initModifiers();
  },


  methods: {
    initModifiers: function initModifiers() {
      for (var modifier in this.modifiers) {
        this.setModifier(modifier, this[modifier] === undefined ? this.modifiers[modifier] : this[modifier]);
      }
    },
    modifierDescriptor: function modifierDescriptor(modifier) {
      var _this = this;

      return {
        get: function get() {
          return _this.getModifier(modifier);
        },
        set: function set(value) {
          return _this.setModifier(modifier, value);
        }
      };
    },
    getModifier: function getModifier(modifier) {
      if (this.modifierType(modifier) === 'boolean') return this.getBooleanModifier(modifier);else return this.getStringModifier(modifier);
    },
    setModifier: function setModifier(modifier, value) {
      if (this.modifierType(modifier) === 'boolean') return this.setBooleanModifier(modifier, value);else return this.setStringModifier(modifier, value);
    },
    modifierType: function modifierType(modifier) {
      return this.modifierValueType(this.modifiers[modifier]);
    },
    modifierValueType: function modifierValueType(value) {
      return [true, false].includes(value) ? 'boolean' : 'string';
    },
    booleanModifierString: function booleanModifierString(modifier) {
      return this.bem + '--' + modifier;
    },
    booleanModifierPattern: function booleanModifierPattern(modifier) {
      return new RegExp('\\b' + this.booleanModifierString(modifier) + '\\b');
    },
    getBooleanModifier: function getBooleanModifier(modifier) {
      if (!this.$el) return false;
      return this.$el.className.match(this.booleanModifierPattern(modifier)) !== null;
    },
    setBooleanModifier: function setBooleanModifier(modifier, value) {
      if (!this.$el) return;

      value = !!value;

      if (this.getBooleanModifier(modifier) !== value) {
        if (value) this.$el.className += ' ' + this.booleanModifierString(modifier);else this.$el.className = this.$el.className.replace(this.booleanModifierPattern(modifier), '').trim();
      }
    },
    stringModifierString: function stringModifierString(modifier, value) {
      return this.bem + '--' + modifier + '--' + value;
    },
    stringModifierPattern: function stringModifierPattern(modifier) {
      return new RegExp('\\b' + this.stringModifierString(modifier, '([^\\s]+)'));
    },
    getStringModifier: function getStringModifier(modifier) {
      if (!this.$el) return null;
      return (this.$el.className.match(this.stringModifierPattern(modifier)) || [null, null])[1];
    },
    setStringModifier: function setStringModifier(modifier, value) {
      if (!this.$el) return;

      if (this.getStringModifier(modifier) !== value) {
        this.$el.className = this.$el.className.replace(this.stringModifierPattern(modifier), '').trim();
        if (value) this.$el.className += ' ' + this.stringModifierString(modifier, value);
      }
    }
  }
};