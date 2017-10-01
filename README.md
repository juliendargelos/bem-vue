<p align="right"><a href="https://codeclimate.com/github/juliendargelos/bem-vue"><img src="https://codeclimate.com/github/juliendargelos/bem-vue/badges/gpa.svg" /></a></p>

# BEM Vue

## Installation
### Install the package:
```
npm install https://github.com/juliendargelos/bem-vue.git --save
```


### Import and include the mixin in a component:
```vue
# src/components/btn.vue
<template>
  <span class="btn">
    <span class="btn__icon"></span>
    <slot></slot>
  </span>
</template>

<script>
import Bem from 'bem-vue'

export default {
  mixins: [Bem]
}
</script>

<style lang="sass">
.btn
  background: black
  padding: 20 25px
  font-size: 14px
  color: white

  &--primary
    background: blue

  &--danger
    background: red

  &--size
    &--small
      font-size: 10px

    &--medium
      font-size: 14px

    &--large
      font-size: 18px

  &__icon
    margin-right: 10px
    display: inline-block
    &--type
      &--add
        content: '+'

      &--remove
        content: '×'

</style>
```

### Specify your BEM block name and your modifiers:
```vue
# src/components/btn.vue

...

<script>
import Bem from 'bem-vue'

export default {
  mixins: [Bem],

  data: function () {
    return {
      bem: {
        name: 'btn',

        modifiers: {
          primary: false,
          danger: false,
          size: null
        },

        elements: {
          icon: {
            type: null
          }
        }
      }
    }
  }
}
</script>

...
```

### Play with it:
```vue
# src/components/btn.vue

<template>
  <span class="btn" @mouseover="size = 'large'" @click="primary = !primary">
    <span class="btn__icon"></span>
    <slot></slot>
  </span>
</template>

...
```

The values you put in `data.modifiers` are used as default values for their modifiers.
They also determine wich type of values will be accepted for their modifiers:
- A `null` or string default value will make the modifier accepting only string and `null` values
- A `true` or `false` default value will make the modifier accepting only boolean values

You can override these default values (but not their type) calling a component and specifying its corresponding props:
```vue
# src/app.vue

<template>
  <btn danger="true" size="small" icon-type="remove"></btn>
</template>

<script>
import Bem from 'bem-vue'

export default {
  mixins: [Bem],
  props: ['danger', 'size', 'icon-type']

...
```
