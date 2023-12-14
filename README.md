# Production: https://memory-rust.vercel.app/

| Demo                                                                                                                        | Focus management(keyboard only)                                                                                             | Screen reader                                                                                                               |
| --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| <video width='200px' src="https://github.com/IvarssonAndreas/memory/assets/15048587/791ab412-26b5-4cf3-b7b4-d5fa41bd4a68"/> | <video width='200px' src="https://github.com/IvarssonAndreas/memory/assets/15048587/45dd616d-7e87-4c93-b73b-74a42fb5f659"/> | <video width='200px' src="https://github.com/IvarssonAndreas/memory/assets/15048587/6ca01b64-8161-4c55-b447-b1fa5023aa90"/> |

# Memory Component

A real memory board does not shuffle itself; instead, the player picks all or some of the cards that the memory game exposes, and places the cards upside down, shuffling them (or skips that part to make it easier). By using the same approach, the game becomes easier to test and construct boards of different sizes. So instead of constructing the board inside the memory component, the board is passed in. Now we can make use of all the card pairs the memory game exposes and shuffle them for our real application. But for testing, we only take a few card pairs and place them in a deterministic manner.

# Testability ❤️ Accessibility

When testing, it is important to avoid testing (implementation details)[https://kentcdodds.com/blog/testing-implementation-details], which could be things like internal state, class names, or IDs. Therefore, most UI testing libraries recommend using selectors that make use of the browser's [Accessibility Tree](<[https://kentcdodds.com/blog/testing-implementation-details](https://developer.mozilla.org/en-US/docs/Glossary/Accessibility_tree)>). Examples include `.getByText('Submit')` instead of `.getByClassName('submit-button')` or `.getByTestId('submit-button')`, etc. However, this can sometimes be tricky. Let's say you have an icon button; what would be the text to select then?

The same is true for Assistive Technologies such as screen readers. What should be announced when focusing on that button? Just "button"? or "button svg"? Either way, it is necessary to understand the context of the button. Therefore, it is important to add descriptive content to things even if the sighted user can understand the UI by its context. A common way is, for example, adding 'delete' text and hiding it (or using `aria-label` on interactive elements). Tailwind, which I'm using, has a class called `sr-only` which does exactly that. MUI has [visuallyHidden](https://mui.com/system/screen-readers/#visually-hidden-elements) for the same purpose.

In this memory game, a sighted user understands the UI; a grey box means that the card is hidden, and if the box has another color, it is picked. A screen reader does not have this context. Therefore, each card has hidden content like "Position 1 hidden," "Position 2 hidden," "Position 6 blue," etc. Now it is playable with a screen reader (probably not a great experience though, I'm far from an expert in accessibility, which is a rabbit hole). This also gives us great testing queries. We can now pick a card in a certain position like "Position 1" or all hidden cards "hidden", or the blue card with 'blue'. `.getByRole('button', {name: 'blue'})` or `.getByRole('button', {name: 'Position 2 blue'})` if we have many blue cards picked already. This is very similar to how a real user navigates the app.

I've created one large test that simulates a complete playthrough of the game, effectively acting as an end-to-end (E2E) test, especially since we don't have a backend.

# Tools

- React https://react.dev/
- Typescript https://www.typescriptlang.org/
- Vite https://vitejs.dev/
- Vitest https://vitest.dev/
- Tailwind https://tailwindcss.com/
