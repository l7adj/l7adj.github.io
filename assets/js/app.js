/* ============================================
   PROP FIRMS HUB - Interactive Engine
   ============================================ */

(function() {
  'use strict';

  // Mobile menu toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mainNav = document.querySelector('.main-nav');

  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      mobileMenuBtn.innerHTML = mainNav.classList.contains('active') ? '✕' : '☰';
    });
  }

  // Header scroll effect
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Filter firms on category page
  const filterBtns = document.querySelectorAll('.filter-btn');
  const firmCards = document.querySelectorAll('.firm-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      firmCards.forEach(card => {
        if (filter === 'all' || card.dataset.type === filter) {
          card.style.display = '';
          card.style.animation = 'slideUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Search functionality
  const searchInput = document.querySelector('.search-input');
  if (searchInput && firmCards.length > 0) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      firmCards.forEach(card => {
        const name = card.querySelector('.firm-name')?.textContent.toLowerCase() || '';
        const programs = card.querySelector('.firm-plans-preview')?.textContent.toLowerCase() || '';
        if (name.includes(query) || programs.includes(query)) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }

  // Copy to clipboard
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy;
      navigator.clipboard.writeText(text).then(() => {
        const original = btn.textContent;
        btn.textContent = '✓ تم النسخ';
        setTimeout(() => btn.textContent = original, 2000);
      });
    });
  });

  // Tab switching on review pages
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      tabPanels.forEach(p => {
        p.classList.toggle('active', p.dataset.panel === tab);
      });
    });
  });

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-slide-up');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.firm-card, .category-card, .tool-card, .content-section').forEach(el => {
    observer.observe(el);
  });

})();

/* ============================================
   FINANCIAL TOOLS
   ============================================ */

// Risk Calculator
function calculateRisk() {
  const accountSize = parseFloat(document.getElementById('risk-account').value);
  const riskPercent = parseFloat(document.getElementById('risk-percent').value);
  const stopLoss = parseFloat(document.getElementById('risk-sl').value);

  if (!accountSize || !riskPercent || !stopLoss) return;

  const riskAmount = accountSize * (riskPercent / 100);
  const lotSize = riskAmount / (stopLoss * 10); // Simplified for forex standard lot

  document.getElementById('risk-result').classList.add('active');
  document.getElementById('risk-amount').textContent = '$' + riskAmount.toFixed(2);
  document.getElementById('risk-lot').textContent = lotSize.toFixed(2) + ' lot';
}

// Pip Calculator
function calculatePip() {
  const lotSize = parseFloat(document.getElementById('pip-lot').value);
  const pair = document.getElementById('pip-pair').value;

  if (!lotSize) return;

  let pipValue = 10; // Standard for most pairs
  if (pair === 'jpy') pipValue = 8.5;
  if (pair === 'xau') pipValue = 10;

  const totalValue = lotSize * pipValue;

  document.getElementById('pip-result').classList.add('active');
  document.getElementById('pip-value').textContent = '$' + totalValue.toFixed(2);
}

// Margin Calculator
function calculateMargin() {
  const accountSize = parseFloat(document.getElementById('margin-account').value);
  const leverage = parseFloat(document.getElementById('margin-leverage').value);
  const lotSize = parseFloat(document.getElementById('margin-lot').value);

  if (!accountSize || !leverage || !lotSize) return;

  const contractSize = lotSize * 100000;
  const marginRequired = contractSize / leverage;
  const marginPercent = (marginRequired / accountSize) * 100;

  document.getElementById('margin-result').classList.add('active');
  document.getElementById('margin-required').textContent = '$' + marginRequired.toFixed(2);
  document.getElementById('margin-percent').textContent = marginPercent.toFixed(1) + '%';
}

// Payout Calculator
function calculatePayout() {
  const accountSize = parseFloat(document.getElementById('payout-account').value);
  const profitTarget = parseFloat(document.getElementById('payout-target').value);
  const split = document.getElementById('payout-split').value;

  if (!accountSize || !profitTarget) return;

  const profit = accountSize * (profitTarget / 100);
  let traderShare = 80;
  if (split.includes('90')) traderShare = 90;
  if (split.includes('100')) traderShare = 100;
  if (split.includes('70')) traderShare = 70;

  const traderProfit = profit * (traderShare / 100);

  document.getElementById('payout-result').classList.add('active');
  document.getElementById('payout-profit').textContent = '$' + profit.toFixed(2);
  document.getElementById('payout-trader').textContent = '$' + traderProfit.toFixed(2);
  document.getElementById('payout-share').textContent = traderShare + '%';
}

// Prop Firm Profit Simulator
function simulatePropFirm() {
  const accountSize = parseFloat(document.getElementById('sim-account').value);
  const monthlyReturn = parseFloat(document.getElementById('sim-return').value);
  const split = parseFloat(document.getElementById('sim-split').value);
  const months = parseInt(document.getElementById('sim-months').value);

  if (!accountSize || !monthlyReturn || !split || !months) return;

  let totalProfit = 0;
  let monthlyData = [];

  for (let i = 1; i <= months; i++) {
    const monthProfit = accountSize * (monthlyReturn / 100);
    const traderShare = monthProfit * (split / 100);
    totalProfit += traderShare;
    monthlyData.push({
      month: i,
      gross: monthProfit,
      net: traderShare,
      cumulative: totalProfit
    });
  }

  document.getElementById('sim-result').classList.add('active');
  document.getElementById('sim-total').textContent = '$' + totalProfit.toFixed(2);
  document.getElementById('sim-monthly-avg').textContent = '$' + (totalProfit / months).toFixed(2);

  // Build mini chart
  const chartContainer = document.getElementById('sim-chart');
  chartContainer.innerHTML = '';
  const maxVal = Math.max(...monthlyData.map(d => d.cumulative));

  monthlyData.forEach(d => {
    const bar = document.createElement('div');
    bar.style.cssText = `
      display: flex;
      align-items: flex-end;
      flex-direction: column;
      gap: 4px;
    `;
    const height = maxVal > 0 ? (d.cumulative / maxVal * 100) : 0;
    bar.innerHTML = `
      <div style="width: 100%; background: linear-gradient(to top, #1a73e8, #1557b0); 
                  height: ${Math.max(height, 5)}px; border-radius: 4px 4px 0 0;"></div>
      <span style="font-size: 10px; color: #5f6368;">${d.month}</span>
    `;
    chartContainer.appendChild(bar);
  });
}

// Drawdown Calculator
function calculateDrawdown() {
  const accountSize = parseFloat(document.getElementById('dd-account').value);
  const maxDD = parseFloat(document.getElementById('dd-max').value);
  const dailyDD = parseFloat(document.getElementById('dd-daily').value);

  if (!accountSize || !maxDD || !dailyDD) return;

  const maxDDAmount = accountSize * (maxDD / 100);
  const dailyDDAmount = accountSize * (dailyDD / 100);
  const safeZone = accountSize - maxDDAmount;

  document.getElementById('dd-result').classList.add('active');
  document.getElementById('dd-max-amount').textContent = '$' + maxDDAmount.toFixed(2);
  document.getElementById('dd-daily-amount').textContent = '$' + dailyDDAmount.toFixed(2);
  document.getElementById('dd-safe').textContent = '$' + safeZone.toFixed(2);
}
