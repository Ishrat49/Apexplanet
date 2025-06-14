'use strict';

// Sidebar toggle functionality
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

sidebarBtn.addEventListener("click", function() { elementToggleFunc(sidebar); });

// Project Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
    const filterSelect = document.querySelector('[data-select]');
    const selectItems = document.querySelectorAll('[data-select-item]');
    const selectValue = document.querySelector('[data-select-value]');
    const projectItems = document.querySelectorAll('[data-filter-item]');

    // Initialize all projects as visible
    function showAllProjects() {
        projectItems.forEach(item => {
            item.classList.add('active');
        });
    }

    // Filter projects based on category
    function filterProjects(category) {
        projectItems.forEach(item => {
            if (category === 'all' || item.dataset.category === category) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Initialize filter functionality
    function initFilter() {
        // Show all projects by default
        showAllProjects();

        // Handle select dropdown toggle
        filterSelect.addEventListener('click', function() {
            elementToggleFunc(this);
        });

        // Handle select item clicks
        selectItems.forEach(item => {
            item.addEventListener('click', function() {
                const selectedValue = this.textContent.toLowerCase();
                selectValue.textContent = this.textContent;
                elementToggleFunc(filterSelect);
                filterProjects(selectedValue);
            });
        });
    }

    // Initialize the filter
    initFilter();
});

// Page Navigation
const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

navigationLinks.forEach(link => {
    link.addEventListener('click', function() {
        const targetPage = this.textContent.toLowerCase();
        
        // Update active state of navigation links
        navigationLinks.forEach(navLink => {
            navLink.classList.remove('active');
        });
        this.classList.add('active');

        // Show/hide pages
        pages.forEach(page => {
            page.classList.remove('active');
            if (page.dataset.page === targetPage) {
                page.classList.add('active');
            }
        });

        window.scrollTo(0, 0);
    });
});

// Contact Form Validation
const form = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn = document.querySelector('[data-form-btn]');

formInputs.forEach(input => {
    input.addEventListener('input', function() {
        formBtn.disabled = !form.checkValidity();
    });
});
