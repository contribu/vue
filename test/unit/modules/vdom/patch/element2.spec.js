import Vue from 'vue'
import { patch } from 'web/runtime/patch'
import VNode from 'core/vdom/vnode'
import { createEmptyVNode } from 'core/vdom/vnode'
import { createAsyncPlaceholder } from 'core/vdom/helpers'
import { SSR_ATTR } from 'shared/constants'

describe('vdom patch: element2', () => {
  it('should not throw when hydrated pending hydrated pending async component is patched by v-if="false"', done => {
    const PendingAsyncComponent = () => new Promise(() => {})
    const ssrAsyncComponent = document.createElement('div')
    ssrAsyncComponent.setAttribute(SSR_ATTR, 'true')
    const vm = new Vue({
      data: {
        visible: true
      },
      components: {
        PendingAsyncComponent
      },
      template: '<pending-async-component v-if="visible"></pending-async-component>'
    }).$mount(ssrAsyncComponent)

    vm.visible = false
    vm.$nextTick(done)
  })

  it('should not throw', () => {
    const ssrAsyncComponent = document.createElement('div')
    ssrAsyncComponent.setAttribute(SSR_ATTR, 'true')

    const asyncPlaceholder = createAsyncPlaceholder(
      () => new Promise(() => {}), // pending promise
      {},
      void 0,
      void 0,
      'an-async-component'
    )

    const comment = createEmptyVNode()

    patch(ssrAsyncComponent, asyncPlaceholder)
    patch(asyncPlaceholder, comment)
  })
})
