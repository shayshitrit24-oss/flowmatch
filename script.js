function toggleMenu() {
            const menu = document.getElementById('dropdown-menu');
            const overlay = document.getElementById('menu-overlay');
            if (menu.style.display === 'none' || menu.style.display === '') {
                menu.style.display = 'block';
                overlay.style.display = 'block';
                document.body.style.overflow = 'hidden';
            } else {
                menu.style.display = 'none';
                overlay.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        }
        
        function navigateToPage(pageName) {
            document.querySelectorAll('.page-container').forEach(page => page.classList.remove('active'));
            document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
            
            const pageElement = document.getElementById('page-' + pageName);
            if (pageElement) {
                pageElement.classList.add('active');
                
                const tabTexts = { 'home': 'דף הבית', 'search': 'חיפוש', 'therapist': 'למטפלים', 'contact': 'צור קשר' };
                document.querySelectorAll('.nav-tab').forEach(tab => {
                    if (tab.textContent.includes(tabTexts[pageName])) {
                        tab.classList.add('active');
                    }
                });
            }
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        function switchHomeTab(tab) {
            const tabBtns = document.querySelectorAll('#page-home .tab-btn');
            const tabContents = document.querySelectorAll('#page-home .tab-content');
            
            tabBtns.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            if (tab === 'patients') {
                if (tabBtns[0]) tabBtns[0].classList.add('active');
                const patientsTab = document.getElementById('patients-tab');
                if (patientsTab) patientsTab.classList.add('active');
            } else if (tab === 'providers') {
                if (tabBtns[1]) tabBtns[1].classList.add('active');
                const providersTab = document.getElementById('providers-tab');
                if (providersTab) providersTab.classList.add('active');
            }
        }