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
      var _this = this;

      if (_typeof(this.bem) !== 'object' || this.bem === null) return;

      ['modifiers', 'elements'].map(function (setter) {
        if (_typeof(_this.bem[setter]) === 'object' && _this.bem[setter] !== null) {
          _this['set' + setter[0].toUpperCase() + setter.substring(1)](_this, _this.$el, _this.bem.name, _this.bem[setter]);
        }
      });
    },
    setElementsDescriptor: function setElementsDescriptor(object, parent, block, elements) {
      for (var name in elements) {
        if (element.hasOwnProperty(name)) {
          object[name] = {};
          this.setElementModifiersDescriptor(object, name, parent, block, elements[name]);
        }
      }
    },
    setElementModifiersDescriptor: function setElementModifiersDescriptor(object, name, parent, block, element) {
      var _this2 = this;

      this.setModifiersDescriptor(object[name], function () {
        return parent.querySelector('.' + _this2.elementString(block, name));
      }, this.elementString(block, name), element, object._props);
    },
    elementString: function elementString(block, name) {
      return block + '__' + name;
    },
    setModifiersDescriptor: function setModifiersDescriptor(object, node, name, modifiers, override) {
      var prefix = name.split('__').slice(1).map(function (part) {
        return part[0].toUpperCase() + part.substring(1);
      }).join('');
      var key, value;
      override = Object.assign({}, override || object._props);

      Object.defineProperties(object, this.modifiersDescriptor(node, name, modifiers));

      for (var modifier in modifiers) {
        if (modifiers.hasOwnProperty(modifier)) {
          key = prefix + modifier[0].toUpperCase() + modifier.substring(1);
          key = key[0].toLowerCase() + key.substring(1);
          value = override[key];
          object[modifier] = value === undefined ? modifiers[modifier] : value;
        }
      }
    },
    modifiersDescriptor: function modifiersDescriptor(node, name, modifiers) {
      var descriptor = {};

      for (var modifier in modifiers) {
        if (modifiers.hasOwnProperty(modifier)) {
          descriptor[modifier] = this.modifierDescriptor(node, name, modifier, modifiers[modifier]);
        }
      }

      return descriptor;
    },
    modifierDescriptor: function modifierDescriptor(node, name, modifier, base) {
      var _this3 = this;

      var type = this.modifierValueType(base);
      var method = type[0].toUpperCase() + type.substring(1) + 'Modifier';
      return {
        get: function get() {
          return _this3['get' + method](node, name, modifier);
        },
        set: function set(value) {
          return _this3['set' + method](node, name, modifier, value);
        }
      };
    },
    modifierValueType: function modifierValueType(value) {
      return [true, false].includes(value) ? 'boolean' : 'string';
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
      value = value === 'false' ? false : !!value;

      if (node && this.getBooleanModifier(node, name, modifier) !== value) {
        if (value) node.className += ' ' + this.booleanModifierString(name, modifier);else node.className = node.className.replace(this.booleanModifierPattern(name, modifier), '').trim();
      }
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
      value = ['undefined', 'null', 'false'].includes(value) ? null : value;

      if (node && this.getStringModifier(node, name, modifier) !== value) {
        node.className = node.className.replace(this.stringModifierPattern(name, modifier), '').trim();
        if (value) node.className += ' ' + this.stringModifierString(name, modifier, value);
      }
    }
  }
};