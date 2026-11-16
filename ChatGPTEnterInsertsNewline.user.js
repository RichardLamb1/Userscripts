// ==UserScript==
// @name         ChatGPT: Enter inserts a newline
// @namespace    local.chatgpt.enter-newline
// @version      1.4.0
// @description  Enter inserts a newline; click Send to submit.
// @match        https://chatgpt.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(() => {
  'use strict';

  window.addEventListener('keydown', (event) => {
    if (
      event.key !== 'Enter' ||
      event.shiftKey ||
      event.ctrlKey ||
      event.altKey ||
      event.metaKey ||
      event.isComposing ||
      event.keyCode === 229
    ) {
      return;
    }

    const target = event.target;
    if (!(target instanceof Element)) return;

    const editor = target.closest(
      'textarea, [contenteditable="true"]'
    );
    if (!editor) return;

    const isComposer =
      editor.id === 'prompt-textarea' ||
      editor.id === 'pending-conversation-input' ||
      editor.matches('[data-testid="prompt-textarea"]') ||
      editor.closest(
        '[data-composer-input], ' +
        'form[data-type="unified-composer"], ' +
        '[data-testid="composer"]'
      );

    if (!isComposer) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    if (editor instanceof HTMLTextAreaElement) {
      const start = editor.selectionStart;
      const end = editor.selectionEnd;
      const value =
        editor.value.slice(0, start) +
        '\n' +
        editor.value.slice(end);

      const setter = Object.getOwnPropertyDescriptor(
        HTMLTextAreaElement.prototype,
        'value'
      ).set;

      setter.call(editor, value);
      editor.setSelectionRange(start + 1, start + 1);
      editor.dispatchEvent(new InputEvent('input', {
        bubbles: true,
        composed: true,
        inputType: 'insertLineBreak',
        data: null
      }));

      return;
    }

    const replacement = new KeyboardEvent('keydown', {
      key: 'Enter',
      code: 'Enter',
      keyCode: 13,
      which: 13,
      shiftKey: true,
      bubbles: true,
      cancelable: true,
      composed: true
    });

    // The shiftKey check above lets this event reach ChatGPT.
    const unhandled = editor.dispatchEvent(replacement);

    // Synthetic events have no native editing action.
    // If the editor didn't handle it, insert a paragraph.
    if (unhandled) {
      document.execCommand('insertParagraph', false, null);
    }
  }, true);
})();