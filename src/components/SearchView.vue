<template>
 <form @submit.prevent='searchFormSubmitHandler'>
    <input type='text' 
           id='searchString' 
           placeholder='Search title, excerpt, location, etc.'
           v-model='searchString'/>

    <input type='submit' id='startSearch' title='Start visualization' value='Show Graph' />
  </form>
</template>

<script type="text/javascript">
  

</script>

<style type="text/css">
  

</style>