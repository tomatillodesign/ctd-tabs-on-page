let isMobileMode = false; // Track mobile or desktop mode
let activeTabSlug = null; // Track active tab slug

function initTabs() {
  const tabGroups = document.querySelectorAll('.ctd-tabs');

  tabGroups.forEach(group => {
    const toc = group.querySelector('.ctd-tabs__toc');
    const contentArea = group.querySelector('.ctd-tabs__content');

    const tabs = toc.querySelectorAll('[role="tab"]');
    const tabPanels = group.querySelectorAll('[role="tabpanel"]');

    // Move tab panels into content area
    tabPanels.forEach(panel => {
      contentArea.appendChild(panel);
    });

    // Default select first tab
    if (tabs.length > 0 && tabPanels.length > 0) {
      tabs[0].setAttribute('aria-selected', 'true');
      tabPanels[0].hidden = false;
      activeTabSlug = tabs[0].getAttribute('data-tab-slug');
    }

    bindTabClicks(group);

    // Handle deep linking
    const currentHash = window.location.hash.substring(1);
    if (currentHash) {
      const targetTab = group.querySelector(`[data-tab-slug="${currentHash}"]`);
      if (targetTab) {
        targetTab.click();
        activeTabSlug = currentHash; // Update active slug
      }
    }
  });
}

function bindTabClicks(group) {
  const tabs = group.querySelectorAll('[role="tab"]');
  const panels = group.querySelectorAll('[role="tabpanel"]');

  tabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      if (isMobileMode) return; // Ignore clicks on mobile
      e.preventDefault();

      const slug = tab.getAttribute('data-tab-slug');
      if (slug) {
        history.replaceState(null, null, `#${slug}`);
        activeTabSlug = slug; // Save the active tab slug
      }

      tabs.forEach(t => t.setAttribute('aria-selected', 'false'));
      panels.forEach(panel => panel.hidden = true);

      tab.setAttribute('aria-selected', 'true');
      const targetId = tab.getAttribute('aria-controls');
      const targetPanel = group.querySelector(`#${targetId}`);
      if (targetPanel) {
        targetPanel.hidden = false;
      }
    });
  });
}

function adjustTabsForMobile() {
  const isNowMobile = window.matchMedia("(max-width: 900px)").matches;

  if (isNowMobile && !isMobileMode) {
    // Switch to mobile mode
    isMobileMode = true;
    console.log('Switching to MOBILE mode.');

    document.querySelectorAll('.ctd-tabs').forEach(group => {
      const toc = group.querySelector('.ctd-tabs__toc');
      const tabs = toc.querySelectorAll('[role="tab"]');
      const panels = group.querySelectorAll('[role="tabpanel"]');

      // Replace tab buttons with a bullet list
      const ul = document.createElement('ul');

      tabs.forEach(tab => {
        const slug = tab.getAttribute('data-tab-slug');
        const label = tab.innerText;

        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = `#${slug}`;
        a.textContent = label;
        li.appendChild(a);
        ul.appendChild(li);
      });

      toc.innerHTML = '';
      toc.appendChild(ul);

      // Show all panels
      panels.forEach(panel => {
        panel.removeAttribute('hidden');
        panel.style.display = 'block';
        panel.style.opacity = '1';
        panel.style.visibility = 'visible';
        panel.style.height = 'auto';
        panel.style.overflow = 'visible';
        panel.style.marginBottom = '2rem';
      });
    });

  } else if (!isNowMobile && isMobileMode) {
    // Switch back to desktop mode
    isMobileMode = false;
    console.log('Switching to DESKTOP mode.');

    document.querySelectorAll('.ctd-tabs').forEach(group => {
      const toc = group.querySelector('.ctd-tabs__toc');
      const contentArea = group.querySelector('.ctd-tabs__content');
      const panels = contentArea.querySelectorAll('[role="tabpanel"]');

      // Rebuild the tab buttons
      let html = '';
      panels.forEach((panel, index) => {
        const slug = panel.getAttribute('id');
        const label = panel.getAttribute('data-label') || `Tab ${index + 1}`;

        html += `<button role="tab" data-tab-slug="${slug}" aria-controls="${slug}" type="button">${label}</button>`;
      });
      toc.innerHTML = html;

      // Hide all panels except the active one
      panels.forEach(panel => {
        if (panel.getAttribute('id') === activeTabSlug) {
          panel.hidden = false;
        } else {
          panel.hidden = true;
        }
      });

      // Rebind tab click handlers
      bindTabClicks(group);

      // Restore active tab button
      const tabs = toc.querySelectorAll('[role="tab"]');
      tabs.forEach(tab => {
        if (tab.getAttribute('data-tab-slug') === activeTabSlug) {
          tab.setAttribute('aria-selected', 'true');
        } else {
          tab.setAttribute('aria-selected', 'false');
        }
      });
    });
  }
}

// Set up
window.addEventListener('load', () => {
  initTabs();
  adjustTabsForMobile();
});
window.addEventListener('resize', adjustTabsForMobile);
