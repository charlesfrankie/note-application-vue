<script setup lang="ts">
import NoteItem from './NoteItem.vue'
import { ref, onMounted, watch } from 'vue'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import { useNoteStore } from '../stores/notes'
import debounce from 'lodash'
import { useToast } from 'vue-toastification'
import type { Note } from '../types/note'

const noteStore = useNoteStore()
const toast = useToast()
const isLoading = ref(true)
const notes = ref<Note[]>([])
const totalCount = ref(0)
const totalPages = ref(0)
const pageNumber = ref(1)
const pageSize = 10
const orderBy = ref('')
const filterBy = ref('')
const search = ref('')

const fetchNotes = async () => {
  try {
    const response = await noteStore.getNotes(
      orderBy.value,
      filterBy.value,
      search.value,
      pageNumber.value,
      pageSize,
    )
    if (response && response.success) {
      notes.value = response.data.notes
      totalCount.value = response.data.totalCount
      totalPages.value = response.data.totalPage
      isLoading.value = false
    }
  } catch (error) {
    console.error('Failed to fetch notes:', error)
  } finally {
    isLoading.value = false
  }
}

const deleteNote = async (id: Number) => {
  const response = await noteStore.deleteNote(id)
  if (response.success) {
    toast.success('Note has been deleted.')
    fetchNotes()
  } else {
    toast.error(response.message)
  }
}

const handleFilter = (type: string) => {
  if (type === 'sort') {
    const selectElement = document.getElementById('sortBy') as HTMLSelectElement
    orderBy.value = selectElement.value

    if (selectElement.value === 'Sort by') {
      orderBy.value = 'created_at-desc'
    }
  } else if (type === 'filter') {
    const selectElement = document.getElementById('filterBy') as HTMLSelectElement
    filterBy.value = selectElement.value

    if (selectElement.value !== 'my_post') {
      filterBy.value = ''
    }
  }
  fetchNotes()
}

const debounceFetchNotes = debounce(fetchNotes, 300)
// Watch for changes in the search input and debounce API calls
watch(search, () => {
  debounceFetchNotes()
})

const prevPage = () => {
  pageNumber.value--
  fetchNotes()
}
const nextPage = () => {
  pageNumber.value++
  fetchNotes()
}

onMounted(fetchNotes)
</script>

<template>
  <div class="note-list p-4">
    <div class="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <h2 class="text-xl xl:text-2xl font-semibold">Notes</h2>
        <input
          type="text"
          id="search"
          name="search"
          v-model="search"
          placeholder="Search..."
          class="w-full p-2 border rounded shadow-sm focus:outline-none focus:ring-gray-400 focus:border-gray-400 text-sm"
        />
      </div>
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <select
          @change="handleFilter('filter')"
          id="filterBy"
          class="bg-white border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
        >
          <option selected>Filter</option>
          <option value="all">All</option>
          <option value="my_post">My post</option>
        </select>
        <select
          @change="handleFilter('sort')"
          id="sortBy"
          class="bg-white border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
        >
          <option selected>Sort by</option>
          <option value="created_at-asc">Date: Ascending</option>
          <option value="created_at-desc">Date: Descending</option>
          <option value="title-asc">Title: A-Z</option>
          <option value="title-desc">Title: Z-A</option>
        </select>
      </div>
    </div>
    <hr class="mt-2 mb-4" />
    <div v-if="isLoading" class="text-center py-6">
      <PulseLoader />
    </div>
    <div v-else class="note-list">
      <NoteItem
        v-for="note in notes"
        :key="note.id ?? note.title"
        :note="note"
        @delete="deleteNote"
      />
    </div>
    <div class="flex items-center justify-center gap-2 my-5">
      <button
        class="bg-gray-900 disabled:bg-gray-600 text-white border px-3 py-1 rounded text-sm hover:bg-gray-600 transition-background duration-200"
        @click="prevPage"
        :disabled="pageNumber === 1"
      >
        Previous
      </button>
      <span>Page {{ pageNumber }} of {{ totalPages }}</span>
      <button
        class="bg-gray-900 disabled:bg-gray-600 text-white border px-3 py-1 rounded text-sm hover:bg-gray-600 transition-background duration-200"
        @click="nextPage"
        :disabled="pageNumber * pageSize >= totalCount"
      >
        Next
      </button>
    </div>
  </div>
</template>

<style scoped></style>
