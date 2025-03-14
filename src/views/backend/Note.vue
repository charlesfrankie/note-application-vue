<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useNoteStore } from '../../stores/notes'
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import dayjs from 'dayjs'
import { useAuthStore } from '../../stores/authentication'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()
const toast = useToast()
const noteStore = useNoteStore()
const isLoading = ref(true)
const notes = ref([])
const totalCount = ref(0)
const totalPages = ref(0)
const pageNumber = ref(1)
const pageSize = 10
const orderBy = ref('')

const fetchNotes = async (orderBy: string | null = null) => {
  const response = await noteStore.getNotes(orderBy, pageNumber.value, pageSize)
  if (response && response.success) {
    notes.value = response.data.notes
    totalCount.value = response.data.totalCount
    totalPages.value = response.data.totalPage
    isLoading.value = false
  }
}

const editNote = async (note) => {
  const authId = useAuthStore().auth_id
  if (authId && parseInt(note.userId) !== parseInt(authId)) {
    toast.error('Permission denied! You have no access to this note.')
  } else {
    router.push(`/admin/notes/edit/${note.id}`)
  }
}

const deleteNote = async (note) => {
  const authId = useAuthStore().auth_id
  if (authId && parseInt(note.userId) !== parseInt(authId)) {
    toast.error('Permission denied! You have no access to this note.')
  } else {
    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--primary-color')
      .trim()

    const result = await Swal.fire({
      title: 'Delete Note',
      text: 'Are you sure you want to delete this note?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it',
      confirmButtonColor: primaryColor,
      cancelButtonText: 'Cancel',
      cancelButtonColor: 'red',
    })

    if (result.isConfirmed) {
      const response = await noteStore.deleteNote(note.id)
      if (response.success) {
        toast.success('Note has been deleted.')
      } else {
        toast.error(response.message)
      }
    }
  }
}

const prevPage = () => {
  pageNumber.value--
  fetchNotes(orderBy.value)
}
const nextPage = () => {
  pageNumber.value++
  fetchNotes(orderBy.value)
}

const handleFilter = (type: string) => {
  if (type === 'sort') {
    const selectElement = document.getElementById('sortBy') as HTMLSelectElement
    orderBy.value = selectElement.value

    if (selectElement.value === 'Sort by') {
      orderBy.value = 'created_at-desc'
    }
    fetchNotes(orderBy.value)
  }
}

onMounted(fetchNotes)
</script>

<template>
  <div class="relative overflow-x-auto mt-5 px-8 py-4">
    <div v-if="isLoading" class="text-center py-6">
      <PulseLoader />
    </div>
    <div v-else>
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <select
            @change="handleFilter('sort')"
            id="sortBy"
            class="bg-white border border-gray-300 text-gray-900 text-sm rounded w-40 focus:ring-blue-500 focus:border-blue-500 block p-2"
          >
            <option selected>Sort by</option>
            <option value="created_at-asc">Date: Ascending</option>
            <option value="created_at-desc">Date: Descending</option>
            <option value="title-asc">Title: A-Z</option>
            <option value="title-desc">Title: Z-A</option>
          </select>
        </div>
      </div>
      <table class="w-full text-sm text-left rtl:text-right text-gray-500 border">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 w-12 min-w-[40px] text-center">No</th>
            <th scope="col" class="px-6 py-3 w-1/6">Title</th>
            <th scope="col" class="px-6 py-3 w-2/6">Content</th>
            <th scope="col" class="px-6 py-3 w-1/6">Date</th>
            <th scope="col" class="px-6 py-3 w-1/6">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(note, index) in notes"
            :key="note.id"
            class="bg-white border-b border-gray-200"
          >
            <th scope="row" class="px-6 py-4 w-12 min-w-[40px] text-center">
              {{ (pageNumber - 1) * pageSize + index + 1 }}
            </th>
            <td class="px-6 py-4 w-1/6">
              {{
                note.title
                  ? note.content.title > 20
                    ? note.title.slice(0, 20) + '...'
                    : note.title
                  : ''
              }}
            </td>
            <td class="px-6 py-4 w-1/6">
              {{
                note.content
                  ? note.content.length > 120
                    ? note.content.slice(0, 120) + '...'
                    : note.content
                  : ''
              }}
            </td>
            <td class="px-6 py-4">
              {{
                note.updated_at
                  ? dayjs(note.updated_at).format('YYYY-MM-DD HH:mm:ss')
                  : note.created_at
                    ? dayjs(note.created_at).format('YYYY-MM-DD HH:mm:ss')
                    : ''
              }}
            </td>
            <td class="px-6 py-4 gap-2 flex">
              <a
                @click="editNote(note)"
                class="bg-green-600 cursor-pointer text-white px-2 py-1 rounded text-sm hover:bg-green-700 transition-background duration-200"
              >
                <img
                  src="../../assets/edit.svg"
                  alt="Edit"
                  class="w-4 md:w-5 h-4 md:h-5 text-white"
                />
              </a>
              <a
                @click="deleteNote(note)"
                class="bg-red-600 cursor-pointer text-white px-2 py-1 rounded text-sm hover:bg-red-700 transition-background duration-200"
              >
                <img
                  src="../../assets/delete.svg"
                  alt="Edit"
                  class="w-4 md:w-5 h-4 md:h-5 text-white"
                />
              </a>
            </td>
          </tr>
        </tbody>
      </table>
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
  </div>
</template>
