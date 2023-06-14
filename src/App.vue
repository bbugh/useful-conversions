<script setup lang="ts">
import configureMeasurements, { allMeasures, type AllMeasuresUnits } from 'convert-units'
import { computed, ref } from 'vue'
import * as data from './data.json'
import { formatNumber, groupBy, titleize } from './utils'

const convert = configureMeasurements(allMeasures)

const definedUnits = Object.keys(data)
const allRealUnits = convert()
  .list()
  .filter((predicate) => definedUnits.includes(predicate.measure))
const groupedUnits = groupBy(allRealUnits, (unit) => unit.measure)

type RealUnit = keyof typeof data

const realNumber = ref()
const selectedRealUnit = ref<AllMeasuresUnits>()
const selectedFunnyUnit = ref<AllMeasuresUnits>()

const hasRealValues = computed(() => realNumber.value && selectedRealUnit.value)

const selectedRealType = computed(() =>
  selectedRealUnit.value
    ? allRealUnits.find((unit) => unit.abbr === selectedRealUnit.value)
    : undefined
)

const selectedRealLabel = computed(() =>
  selectedRealType.value
    ? realNumber.value === 1
      ? selectedRealType.value.singular
      : selectedRealType.value.plural
    : undefined
)

const funnyUnits = computed(() =>
  selectedRealType.value ? data[selectedRealType.value.measure as RealUnit] : []
)

const selectedFunnyType = computed(() =>
  selectedRealType.value && selectedFunnyUnit.value
    ? data[selectedRealType.value.measure as RealUnit]?.find(
        (unit) => unit.funnyUnit === selectedFunnyUnit.value
      )
    : undefined
)

const funnyQuantity = computed(() =>
  selectedRealUnit.value && selectedFunnyType.value
    ? convert(realNumber.value)
        .from(selectedRealUnit.value)
        .to(selectedFunnyType.value.realUnit as AllMeasuresUnits) /
      selectedFunnyType.value.conversionFactor
    : 0
)
</script>

<template>
  <main class="pt-0">
    <section>
      <form>
        <h2>Convert</h2>
        <div class="flex-row">
          <div>
            <label for="quantity">Quantity</label>
            <input id="quantity" v-model="realNumber" type="number" class="w-100 quantity-input" />
          </div>

          <div>
            <label for="realUnit">Real Unit</label>
            <select id="realUnit" v-model="selectedRealUnit" class="w-100">
              <optgroup
                v-for="(units, measure) in groupedUnits"
                :key="measure"
                :label="titleize(measure)"
              >
                <option v-for="realUnit in units" :key="realUnit.abbr" :value="realUnit.abbr">
                  {{ realUnit.plural }} ({{ realUnit.abbr }})
                </option>
              </optgroup>
            </select>
          </div>
        </div>
        <h2>To</h2>
        <div>
          <label for="funnyUnit">Useful Unit</label>
          <select
            id="funnyUnit"
            v-model="selectedFunnyUnit"
            :disabled="!hasRealValues"
            class="w-100"
          >
            <option
              v-for="funnyUnit in funnyUnits"
              :key="funnyUnit.funnyUnit"
              :value="funnyUnit.funnyUnit"
            >
              {{ funnyUnit.funnyUnit }}
            </option>
          </select>
        </div>

        <div v-if="realNumber && selectedRealUnit && selectedFunnyUnit" class="result">
          <strong> {{ realNumber }} {{ selectedRealLabel }} </strong>
          is equivalent to
          <strong>
            {{ formatNumber(funnyQuantity) }}
            {{ selectedFunnyUnit }}
          </strong>
        </div>
        <div v-else>ℹ️ Select a unit and quantity to see the useful measurement.</div>
      </form>
    </section>
  </main>
</template>

<style scoped>
.flex-row {
  display: flex;
  flex-direction: column;
}

@media only screen and (min-width: 768px) {
  .quantity-input {
    max-width: 150px;
  }

  .flex-row {
    flex-direction: row;
  }
}

.result {
  font-size: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.w-100 {
  width: 100%;
}

.pt-0 {
  padding-top: 0;
}
</style>
