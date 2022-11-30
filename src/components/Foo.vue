<template>
  <Test />
</template>

<script lang="tsx">
  import { defineComponent } from 'vue';

  export default defineComponent({
    name: 'Foo',

    setup() {
      function handleClick() {
        console.log('Test jsx ok!');
      }

      function Test() {
        return (
          <a-button onClick={handleClick} class="App-test">
            Test jsx vite
          </a-button>
        );
      }

      return () => Test();
    },
  });
</script>
