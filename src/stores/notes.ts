import { defineStore } from 'pinia'
import type { Note } from '../types/note'
import apiClient from '../axiosIntance'
import { useAuthStore } from './authentication'

export const useNoteStore = defineStore('note', {
  state: () => ({
    notes: [] as Note[],
    selectedNote: null as Note | null,
  }),
  actions: {
    async getNotes(
      orderBy: string | null = null,
      pageNumber: Number | null = 1,
      pageSize: Number | null = 10,
    ) {
      try {
        const response = await apiClient.get('/notes', {
          params: {
            order_by: orderBy,
            page: pageNumber ?? 1,
            perPage: pageSize ?? 10,
          },
        })
        if (response.status == 200) {
          this.notes = response.data.result.notes
        }
        return { success: true, data: response.data.result }
      } catch (error) {
        console.error(error)
      }
    },
    setNote(notes: Note[]) {
      this.notes = notes
    },
    async addNote(note: Note) {
      try {
        const response = await apiClient.post(
          '/notes/create',
          {
            title: note.title,
            content: note.content,
          },
          {
            headers: {
              Authorization: 'Bearer ' + useAuthStore().token,
            },
          },
        )
        this.notes.unshift(note)
        return { success: true, message: response.data.message }
      } catch (error: any) {
        return { success: false, message: error.response.data }
      }
    },
    async deleteNote(id: number) {
      try {
        const response = await apiClient.delete(`/notes/delete/${id}`, {
          headers: {
            Authorization: 'Bearer ' + useAuthStore().token,
          },
        })
        this.notes = this.notes.filter((note) => note.id !== id)
        return { success: true, message: response.data.message }
      } catch (error) {
        return { success: false, message: error }
      }
    },
    editNote(note: Note | null) {
      this.selectedNote = note
    },
    async getNoteById(id: Number) {
      try {
        const response = await apiClient.get(`/notes/${id}`)
        return { success: true, note: response.data }
      } catch (error) {
        return { success: false }
      }
    },
    async updateNote(note: Note) {
      try {
        const response = await apiClient.put(
          `/notes/update/${note.id}`,
          {
            title: note.title,
            content: note.content,
          },
          {
            headers: {
              Authorization: 'Bearer ' + useAuthStore().token,
            },
          },
        )
        const index = this.notes.findIndex((n) => n.id === note.id)
        if (index !== -1) {
          this.notes[index] = note
        }
        return { success: true, message: response.data.message }
      } catch (error) {
        return { success: false, message: error }
      }
    },
  },
  getters: {},
})
