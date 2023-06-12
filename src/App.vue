<script setup lang="ts">
import { computed, ref } from 'vue'
import * as data from './data.json'

import configureMeasurements, { allMeasures, type AllMeasuresUnits } from 'convert-units'
const convert = configureMeasurements(allMeasures)

const allRealUnits = convert().list()

type RealUnit = keyof typeof data

const funnyUnits = computed(() =>
  selectedRealType.value
    ? data[selectedRealType.value as RealUnit] // this is a bad casting, it could be other types
    : []
)

const realNumber = ref(150)
const selectedRealUnit = ref<AllMeasuresUnits>()
const selectedFunnyUnit = ref<AllMeasuresUnits>()

const selectedRealType = computed(() =>
  selectedRealUnit.value
    ? allRealUnits.find((unit) => unit.abbr === selectedRealUnit.value)?.measure
    : undefined
)

const selectedFunnyType = computed(() =>
  selectedRealType.value && selectedFunnyUnit.value
    ? data[selectedRealType.value as RealUnit]?.find((unit) => unit.funnyUnit === selectedFunnyUnit.value)
    : undefined
)

const funnyCount = computed(() =>
  selectedRealUnit.value && selectedFunnyType.value
    ? convert(realNumber.value).from(selectedRealUnit.value).to(selectedFunnyType.value.realUnit as AllMeasuresUnits) / selectedFunnyType.value.conversionFactor
    : 0
)
</script>

<template>
  <main>
    <div style="display: flex; flex-direction: row">
      <input v-model="realNumber" type="number" />
      <select v-model="selectedRealUnit">
        <option v-for="realUnit in allRealUnits" :key="realUnit.abbr" :value="realUnit.abbr">
          {{ realUnit.plural }} ({{ realUnit.abbr }}) [{{ realUnit.measure }}]
        </option>
      </select>
      TO
      <select v-model="selectedFunnyUnit">
        <option
          v-for="funnyUnit in funnyUnits"
          :key="funnyUnit.funnyUnit"
          :value="funnyUnit.funnyUnit"
        >
          {{ funnyUnit.funnyUnit }}
        </option>
      </select>
    </div>

    <div>{{ realNumber }} {{ selectedRealUnit }} = about {{ funnyCount }} {{ selectedFunnyUnit }}</div>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
