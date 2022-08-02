<template>
  <div class="metrics">
    <span class="metrics-label">{{label}}</span>
    <p class="metrics-value flex">
      <sub>
        <slot name="icon">
          <i :class="icon"></i>
        </slot>
      </sub>
      <span class="val">{{value}}</span>
    </p>
  </div>
</template>

<script>
export default {
  props: ['label', 'value', 'icon'],
  name: 'metrics',
  data () {
    return {
      defaultTitle: 'Default Title'
    }
  }
}
</script>

<style lang="scss">
.metrics {
  p {margin: 0}
  margin: .5rem;
  border:1px solid #d6d8e1;
  width: 95%;
  min-height: 8.5rem;
  background-color: $--color-bg-light;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  &-label {
    margin-bottom: .9rem;
    font-size: .875rem;
    font-weight: 500;
    color: #888c9b;
    white-space: nowrap;
  }
  &-value {
    margin-bottom: 0;
    line-height: 1;
    white-space: nowrap;
    font-size: 1.75rem;
    justify-content: center;
    align-items: center;
    sub {
      bottom:0;
      font-size: 60%;
      line-height: 1;
      color: #888c9b;
    }
    .val {
      padding: 0 10px;
    }
  }
}
</style>
