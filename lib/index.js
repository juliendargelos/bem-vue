'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = {
  mounted: function mounted() {
    this.initBem();
  },


  methods: {
    initBem: function initBem() {
      if (_typeof(this.bem) !== 'object' || this.bem === null) return;

      if (_typeof(this.bem.modifiers) === 'object' && this.bem.modidifers !== null) {
        this.setModifiersDescriptor(this, this.$el, this.bem.name, this.bem.modifiers);
      }

      if (_typeof(this.bem.elements) === 'object' && this.bem.elements !== null) {
        this.setElementsDescriptor(this, this.$el, this.bem.name, this.bem.elements);
      }
    },
    setElementsDescriptor: function setElementsDescriptor(object, parent, block, elements) {
      var _this = this;

      var override = {};

      for (var property in object) {
        if (property.match(/^is[A-Z]/) !== null) {
          override[property.substring(2, 1).toLowerCase() + property.substring(4)] = object[property];
        }
      }

      for (var name in elements) {
        object[name] = {};
        this.setModifiersDescriptor(object[name], function () {
          return parent.querySelector('.' + _this.elementString(block, name));
        }, this.elementString(block, name), elements[name], override);
      }
    },
    elementString: function elementString(block, name) {
      return block + '__' + name;
    },
    setModifiersDescriptor: function setModifiersDescriptor(object, node, name, modifiers, override) {
      override = Object.assign({}, override || object);
      Object.defineProperties(object, this.modifiersDescriptor(node, name, modifiers, override));

      for (var modifier in modifiers) {
        object[modifier] = override[modifier] === undefined ? modifiers[modifier] : override[modifier];
      }
    },
    modifiersDescriptor: function modifiersDescriptor(node, name, modifiers, override) {
      var descriptor = {};

      for (var modifier in modifiers) {
        descriptor[modifier] = this.modifierDescriptor(node, name, modifier, modifiers[modifier]);
      }

      return descriptor;
    },
    modifierDescriptor: function modifierDescriptor(node, name, modifier, base) {
      if (this.modifierValueType(base) === 'boolean') {
        return this.booleanModifierDescriptor(node, name, modifier);
      } else {
        return this.stringModifierDescriptor(node, name, modifier);
      }
    },
    modifierValueType: function modifierValueType(value) {
      return [true, false].includes(value) ? 'boolean' : 'string';
    },
    booleanModifierDescriptor: function booleanModifierDescriptor(node, name, modifier) {
      var _this2 = this;

      return {
        get: function get() {
          return _this2.getBooleanModifier(node, name, modifier);
        },
        set: function set(value) {
          return _this2.setBooleanModifier(node, name, modifier, value);
        }
      };
    },
    booleanModifierString: function booleanModifierString(name, modifier) {
      return name + '--' + modifier;
    },
    booleanModifierPattern: function booleanModifierPattern(name, modifier) {
      return new RegExp('\\b' + this.booleanModifierString(name, modifier) + '\\b');
    },
    getBooleanModifier: function getBooleanModifier(node, name, modifier) {
      if (!node) return false;
      if (typeof node === 'function') node = node();

      return node ? node.className.match(this.booleanModifierPattern(name, modifier)) !== null : false;
    },
    setBooleanModifier: function setBooleanModifier(node, name, modifier, value) {
      if (!node) return;
      if (typeof node === 'function') node = node();
      value = !!value;

      if (node && this.getBooleanModifier(node, name, modifier) !== value) {
        if (value) node.className += ' ' + this.booleanModifierString(name, modifier);else node.className = node.className.replace(this.booleanModifierPattern(name, modifier), '').trim();
      }
    },
    stringModifierDescriptor: function stringModifierDescriptor(node, name, modifier) {
      var _this3 = this;

      return {
        get: function get() {
          return _this3.getStringModifier(node, name, modifier);
        },
        set: function set(value) {
          return _this3.setStringModifier(node, name, modifier, value);
        }
      };
    },
    stringModifierString: function stringModifierString(name, modifier, value) {
      return name + '--' + modifier + '--' + value;
    },
    stringModifierPattern: function stringModifierPattern(name, modifier) {
      return new RegExp('\\b' + this.stringModifierString(name, modifier, '([^\\s]+)') + '\\b');
    },
    getStringModifier: function getStringModifier(node, name, modifier) {
      if (!node) return null;
      if (typeof node === 'function') node = node();

      return node ? (node.className.match(this.stringModifierPattern(name, modifier)) || [null, null])[1] : null;
    },
    setStringModifier: function setStringModifier(node, name, modifier, value) {
      if (!node) return;
      if (typeof node === 'function') node = node();
      value = value + '';
      value = value.match(/\s/) !== null ? null : value || null;

      if (node && this.getStringModifier(node, name, modifier) !== value) {
        node.className = node.className.replace(this.stringModifierPattern(name, modifier), '').trim();
        if (value) node.className += ' ' + this.stringModifierString(name, modifier, value);
      }
    }
  }
};