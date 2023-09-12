<script setup lang="ts">
import { buttonVariants } from '.'
import { cn } from '@/lib/utils'

interface Props {
  variant?: NonNullable<Parameters<typeof buttonVariants>[0]>['variant']
  size?: NonNullable<Parameters<typeof buttonVariants>[0]>['size']
  as?: string
}

withDefaults(defineProps<Props>(), {
  as: 'button',
})
</script>

<template>
  <div class="relative w-fit">
    <component
      :disabled="$attrs.disabled"
      :is="as"
      :class="cn(buttonVariants({ variant, size }), $attrs.class ?? '')"
    >
      <slot />
    </component>
    <div :class="['absolute border border-slate-500 -bottom-[5px] left-[0.5px] w-[39px] h-[45px] bg-slate-400 rounded-b-[9px] rounded-t-lg z-0']" v-if="variant === 'tile'">
      
    </div>
  </div>
</template>
