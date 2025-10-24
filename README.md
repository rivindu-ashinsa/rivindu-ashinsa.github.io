// ...existing code...

# Rivindu Ashinsa — Portfolio

Welcome to my personal portfolio website! Here, you can explore my projects, skills, certifications, and contact information.

## Live Entry Point
- Access the website: [index.html](index.html)

## Repository Files
- [index.html](index.html): Main HTML layout and content
- [style.css](style.css): Site styles and responsive rules
- [type.js](type.js): Client-side interactions and animations
- [README.md](README.md): Documentation for this project

## Features
- Typing hero subtitle powered by the [`texts` array](type.js) and the [`type()`](type.js) function in [type.js](type.js).
- Smooth scrolling and active navigation highlighting (scroll logic implemented in [type.js](type.js)).
- Mobile sidebar toggle functionality via [`toggleMenu()`](type.js).
- Contact form handler created with [`handleSubmit()`](type.js) (currently displays a confirmation alert).
- Section entrance animations managed by the [`observer`](type.js) IntersectionObserver instance.
- Responsive layout and components defined in [style.css](style.css).

## How to Run
1. Open [index.html](index.html) in a web browser (double-click or serve with a static server).
    - Optional local server: Run `python -m http.server` from the project directory and access it at http://localhost:8000.

## Customization
- To change the rotating hero text, edit the `texts` array in [type.js](type.js).
- Update UI styles by modifying [style.css](style.css).
- Edit page content (projects, links, resume path) by updating [index.html](index.html).
- Replace placeholder links and contact information in [index.html](index.html) with your actual profiles and email.

## Notes & TODOs
- Replace placeholder external links (GitHub, LinkedIn, Kaggle, resume.pdf) in [index.html](index.html).
- Consider replacing the alert in [`handleSubmit()`](type.js) with a real backend endpoint or a service like Formspree.
- Improve accessibility by adding aria attributes for the sidebar toggle and form fields.
- Add meta/social images and a manifest for better sharing and PWA support.

## License
MIT License

Copyright (c) 2023 Rivindu Ashinsa

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
