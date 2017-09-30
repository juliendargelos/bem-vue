# BEM Vue
This Vue mixin makes easier manipulating BEM block with Vue component.

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
      bem: 'btn',
      modifiers: {
        primary: false,
        danger: false,
        size: null
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
  <span class="btn" @mouseover="own.size = 'large'" @click="is.primary = !is.primary">
    <slot></slot>
  </span>
</template>

...
```

The values you put in `data.modifiers` are used as default values for their modifier.
They also determine wich type of values will be accepted for this modifier:
- A `null` or string default value will make the modifier accepting only string and `null` values
- A `true` or `false` default value will make the modifier accepting only boolean values

You can override these default values calling a component and specifying its corresponding props:
```vue
# src/app.vue

<template>
  <btn :danger="true" size="small"></btn>
</template>

...
```
