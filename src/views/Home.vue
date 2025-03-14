<script setup lang="ts">
import NoteList from '../components/NoteList.vue'
import NoteForm from '../components/NoteForm.vue'
</script>

<template>
  <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
    <div class="col-span-2 sm:col-span-1">
      <NoteForm />
    </div>
    <div class="col-span-2">
      <NoteList />
    </div>
  </div>
</template>
