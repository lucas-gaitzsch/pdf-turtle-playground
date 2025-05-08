<template>
  <div class="q-pa-lg">
    <table>
      <tbody>
        <tr>
          <td>Author:</td>
          <td>Lucas Gaitzsch</td>
        </tr>
        <tr>
          <td>Sourcecode and contribution:</td>
          <td>
            <a :href="githubUrl">{{ githubUrl }}</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

const githubUrl = ref("https://github.com/lucas-gaitzsch/pdf-turtle")
</script>
