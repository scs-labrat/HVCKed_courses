# Course Collection Site

This is a static website containing a collection of courses and their learning materials. It's designed to provide a simple, browseable interface for accessing course outlines and module content directly in your web browser.

## How to Access

1.  Locate the `index.html` file in the root directory of this collection.
2.  Open the `index.html` file in your preferred web browser (like Chrome, Firefox, Safari, Edge, etc.).

**Note:** For the best experience and to ensure all features (especially dynamic content loading) work correctly, it is highly recommended to view this site using a simple local web server rather than opening the `index.html` file directly from your file system (using `file://` in the URL).

*   If you have **VS Code**, the "Live Server" extension is an easy way to do this.
*   Alternatively, you can install `http-server` globally (`npm install -g http-server`), navigate your terminal *into* the directory containing `index.html`, and run the command `http-server`. Then open the URL provided in your terminal (usually `http://127.0.0.1:8080`).

## Site Features

*   **Course Catalog:** The initial page (`index.html`) shows a list of all available courses. Click on a course title to navigate to its dedicated page.
*   **Individual Course Pages:** Each course has its own page with a header, tabs, and a main content area.
*   **Tabbed Navigation:** On a course page, you'll see tabs like "Overview" and "Course Content". Click these tabs to switch between different views or actions.
*   **Overview Tab:** This is the default view for a course. It typically contains an "About This Course" section (the course outline) and a list of the modules within the course.
*   **Course Content (Dropdown):** Clicking the "Course Content" tab does *not* load content directly into the main area. Instead, it opens a dropdown menu listing all the modules in the course.
*   **Module Content:**
    *   Clicking a module link *in the "Course Content" dropdown* or *in the module list on the "Overview" tab* will load that specific module's content into the main content area of the page.
    *   The URL in your browser's address bar will update with a hash (e.g., `#module-1`) so you can bookmark or share links to specific modules.
*   **Dynamic Loading:** Module and overview content is loaded dynamically using JavaScript as you click links/tabs, without requiring a full page refresh.
*   **Sidebar (Overview Only):** On the "Overview" tab, you may see a sidebar area containing additional information like a progress placeholder or sections for "What You'll Learn" and "Requirements". The sidebar is hidden when viewing individual module content.
*   **Discussion Tab:** This tab is currently a static placeholder and does not contain a functional discussion forum.

## Understanding the Layout

When viewing a course page:

*   The **top area** contains the course title, a brief description placeholder, and key statistics (like module count).
*   Below the header is the **tab navigation** ("Overview", "Course Content", etc.).
*   The main part of the page is divided into a **main content area** (left, wider) and a **sidebar area** (right, narrower, only visible in Overview).
*   The **main content area** is where the course outline (Overview tab), the module list (Overview tab), or individual module content (when selected) is displayed.
*   The **sidebar area** is only populated and visible when the "Overview" tab is active.

## Limitations

Please note that this is a **static** site. This means:

*   There are **no user accounts** or login capabilities.
*   There is **no progress tracking** or saving of your learning status.
*   The **Discussion** tab is non-functional.
*   There are **no interactive elements** like quizzes, assignments, or practical exercises beyond reading the content.
*   The content is fixed; it cannot be updated without generating a new version of the site files.

This site is intended solely for browsing and reading the provided course materials offline or via simple web hosting.

## Styling

The site features a dark theme with green accents for elements like headings and links.

Enjoy browsing the course collection!