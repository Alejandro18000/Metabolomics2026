/* ==========================================================================
   Apple Liquid Glass UI - Presentation Engine and Interactive Widgets
   ========================================================================== */

// --- Configuración de Actividad Interactiva Mentimeter ---
// REEMPLAZA estas URLs con los enlaces de tu propia encuesta en Mentimeter:
const MENTIMETER_VOTE_URL = "https://www.menti.com/"; // URL para participantes (puedes cambiarla por tu URL directa de votación)
const MENTIMETER_EMBED_URL = "https://embed.mentimeter.com/embed/c04b8d78572b9148d21c3272d561a3ba/7d235bc6c3e7"; // URL de resultados (la obtienes del Embed Code)

// --- Global Presentation State ---
let currentSlideIndex = 1;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const progressBar = document.getElementById('hud-progress');
const currentSlideCounter = document.getElementById('current-slide-num');

// --- Setup Mentimeter Live survey variables dynamically ---
function setupMentimeterDemo() {
    const qrImage = document.getElementById('menti-qr-code');
    const joinBtn = document.getElementById('menti-join-btn');
    const resultsIframe = document.getElementById('menti-results-iframe');
    
    if (qrImage) {
        // Genera un código QR dinámico de alta definición basado en la URL de votación
        qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(MENTIMETER_VOTE_URL)}`;
    }
    if (joinBtn) {
        joinBtn.href = MENTIMETER_VOTE_URL;
    }
    if (resultsIframe) {
        resultsIframe.src = MENTIMETER_EMBED_URL;
    }
}

// --- Initial Launch Settings ---
document.addEventListener('DOMContentLoaded', () => {
    setupMentimeterDemo();
    initPresentation();
    setupKeyboardListeners();
    setupVideoControls();
    buildDrawerMenu();
    initMassHunterHotspots();
    initWorkflowFlowchart();
    initChromatograms();
});

// --- Presentation Controller ---
function initPresentation() {
    // Show first slide
    showSlide(currentSlideIndex);
}

function showSlide(index) {
    if (index < 1) index = 1;
    if (index > totalSlides) index = totalSlides;
    
    // Deactivate current active slide and pause its videos
    const activeSlide = document.querySelector('.slide.active');
    if (activeSlide) {
        activeSlide.classList.remove('active');
        const videos = activeSlide.querySelectorAll('video');
        videos.forEach(v => v.pause());
    }
    
    // Set new current index
    currentSlideIndex = index;
    
    // Activate new slide
    const targetSlide = document.getElementById(`slide-${currentSlideIndex}`);
    if (targetSlide) {
        targetSlide.classList.add('active');
        
        // Auto-play videos on active slide
        const videos = targetSlide.querySelectorAll('video');
        videos.forEach(v => {
            v.currentTime = 0;
            v.play().catch(e => {
                // Autoplay block handler (standard browser behavior)
                console.log("Autoplay prevented, waiting for user interaction.");
            });
        });
    }
    
    // Trigger slide-specific animations or widgets
    if (currentSlideIndex === 18) {
        if (typeof startFlowchartSimulation === 'function') {
            startFlowchartSimulation();
        }
    } else {
        if (typeof stopFlowchartSimulation === 'function') {
            stopFlowchartSimulation();
        }
    }
    
    if (currentSlideIndex === 19) {
        if (typeof startChromatogramScanAnimation === 'function') {
            startChromatogramScanAnimation();
        }
    } else {
        if (typeof stopChromatogramScanAnimation === 'function') {
            stopChromatogramScanAnimation();
        }
    }
    
    // Update HUD indicator
    updateHUD();
    
    // Highlight active item in drawer
    updateDrawerActiveItem();
}

function nextSlide() {
    if (currentSlideIndex < totalSlides) {
        showSlide(currentSlideIndex + 1);
    }
}

function prevSlide() {
    if (currentSlideIndex > 1) {
        showSlide(currentSlideIndex - 1);
    }
}

// Update HUD stats
function updateHUD() {
    const pct = ((currentSlideIndex - 1) / (totalSlides - 1)) * 100;
    progressBar.style.width = `${pct}%`;
    currentSlideCounter.textContent = currentSlideIndex;
}

// Setup keyboard bindings
function setupKeyboardListeners() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
            nextSlide();
            e.preventDefault();
        } else if (e.key === 'ArrowLeft' || e.key === 'Backspace' || e.key === 'PageUp') {
            prevSlide();
            e.preventDefault();
        }
    });
}

// Handle video loop and click-to-play
function setupVideoControls() {
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach(video => {
        video.setAttribute('loop', 'true');
        // Let clicking on video toggle play/pause
        video.addEventListener('click', (e) => {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
            e.stopPropagation();
        });
    });
}

// --- Toggle Dark/Light Mode ---
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    document.body.classList.toggle('dark-mode');
    
    // Re-draw chromatograms to fit the theme color adjustments
    initChromatograms();
}

// --- Slide Drawer Navigator ---
const slideTitles = [
    "Pre-processing Intro",
    "Mentimeter Activity",
    "PeakMeister App",
    "Download R & RStudio",
    "Initial Considerations (Video)",
    "GitHub Setup",
    "PeakMeister 2.0 Software",
    "Installing PeakMeister (Video)",
    "Convert Data Files",
    "MSConvert Wizard (Video)",
    "Parameter Settings (Video)",
    "Running the App (Video)",
    "Interacting with Interface (Video)",
    "PeakMeister Outcomes (Video)",
    "Processing Real Datafile (Video)",
    "Editing Peak Data (Video)",
    "Exploring Features (Video)",
    "Pre-processing Workflow",
    "Stacked Chromatograms & MTI",
    "Acknowledgements",
    "Feedback",
    "Closing & McMaster Lab"
];

function buildDrawerMenu() {
    const drawerGrid = document.querySelector('.drawer-grid');
    drawerGrid.innerHTML = '';
    
    slideTitles.forEach((title, idx) => {
        const slideNum = idx + 1;
        const item = document.createElement('div');
        item.className = 'drawer-item';
        item.id = `drawer-item-${slideNum}`;
        item.onclick = () => {
            showSlide(slideNum);
            closeDrawer();
        };
        
        item.innerHTML = `
            <span class="drawer-item-num">${slideNum}</span>
            <span class="drawer-item-title">${title}</span>
        `;
        drawerGrid.appendChild(item);
    });
    
    updateDrawerActiveItem();
}

function openDrawer() {
    document.getElementById('slide-drawer').classList.remove('hidden');
}

function closeDrawer(event) {
    if (!event || event.target.id === 'slide-drawer' || event.target.classList.contains('drawer-close-btn')) {
        document.getElementById('slide-drawer').classList.add('hidden');
    }
}

function updateDrawerActiveItem() {
    document.querySelectorAll('.drawer-item').forEach(item => {
        item.classList.remove('active-item');
    });
    const activeItem = document.getElementById(`drawer-item-${currentSlideIndex}`);
    if (activeItem) {
        activeItem.classList.add('active-item');
        activeItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
}

// --- Slide 1 Widget: Live Voting Poll ---
let pollVotes = {
    coffee: 0,
    tea: 0,
    other: 0
};

function vote(choice) {
    // Register vote
    pollVotes[choice] += Math.floor(Math.random() * 5) + 3; // add a few simulated votes to look dynamic
    
    // Add 1 vote to selected
    pollVotes[choice] += 1;
    
    // Calculate percentages
    const total = pollVotes.coffee + pollVotes.tea + pollVotes.other;
    const pctCoffee = Math.round((pollVotes.coffee / total) * 100);
    const pctTea = Math.round((pollVotes.tea / total) * 100);
    const pctOther = 100 - (pctCoffee + pctTea); // make sure they sum to 100
    
    // Hide buttons, show results
    document.querySelector('.poll-options').classList.add('hidden');
    const resultsContainer = document.querySelector('.poll-results');
    resultsContainer.classList.remove('hidden');
    
    // Animate bars
    setTimeout(() => {
        resultsContainer.querySelector('.coffee-bar').style.width = `${pctCoffee}%`;
        resultsContainer.querySelector('.tea-bar').style.width = `${pctTea}%`;
        resultsContainer.querySelector('.other-bar').style.width = `${pctOther}%`;
        
        document.getElementById('pct-coffee').textContent = `${pctCoffee}%`;
        document.getElementById('pct-tea').textContent = `${pctTea}%`;
        document.getElementById('pct-other').textContent = `${pctOther}%`;
    }, 100);
}

function resetVote() {
    // Reset votes
    pollVotes = { coffee: 0, tea: 0, other: 0 };
    
    // Reset bars
    const resultsContainer = document.querySelector('.poll-results');
    resultsContainer.querySelector('.coffee-bar').style.width = `0%`;
    resultsContainer.querySelector('.tea-bar').style.width = `0%`;
    resultsContainer.querySelector('.other-bar').style.width = `0%`;
    
    // Hide results, show buttons
    resultsContainer.classList.add('hidden');
    document.querySelector('.poll-options').classList.remove('hidden');
}

// --- Slide 14 Widget: Agilent MassHunter Hotspots ---
function initMassHunterHotspots() {
    const hotspots = document.querySelectorAll('.hotspot');
    const overlays = document.querySelectorAll('.info-overlay');
    const defaultOverlay = document.getElementById('info-default');
    
    hotspots.forEach(hotspot => {
        // Toggle overlay on click
        hotspot.addEventListener('click', (e) => {
            const targetId = hotspot.getAttribute('data-target');
            
            overlays.forEach(overlay => {
                overlay.classList.add('hidden');
            });
            
            const targetOverlay = document.getElementById(targetId);
            if (targetOverlay) {
                targetOverlay.classList.remove('hidden');
            }
            e.stopPropagation();
        });
        
        // Show info on hover
        hotspot.addEventListener('mouseenter', () => {
            const targetId = hotspot.getAttribute('data-target');
            overlays.forEach(overlay => overlay.classList.add('hidden'));
            document.getElementById(targetId).classList.remove('hidden');
        });
    });
    
    // Clicking anywhere else resets to default description
    const container = document.querySelector('.masshunter-interactive');
    if (container) {
        container.addEventListener('click', () => {
            overlays.forEach(overlay => overlay.classList.add('hidden'));
            defaultOverlay.classList.remove('hidden');
        });
    }
}

// --- Slide 12 Widget: Workflow Flowchart ---
function initWorkflowFlowchart() {
    const nodes = document.querySelectorAll('.flow-hover-node');
    const detailBox = document.getElementById('flowchart-detail-box');
    const detailTitle = detailBox.querySelector('.detail-title');
    const detailDuration = detailBox.querySelector('.detail-duration');
    const detailBody = detailBox.querySelector('.detail-body');
    const flowchartSection = document.getElementById('slide-18');
    
    if (!nodes.length || !detailBox || !flowchartSection) return;
    
    nodes.forEach(node => {
        node.addEventListener('mouseenter', (e) => {
            const stepNum = node.getAttribute('data-step');
            const duration = node.getAttribute('data-duration');
            const details = node.getAttribute('data-details');
            
            // Get step title
            const titles = [
                "File conversion (.mz5)",
                "Set parameters",
                "Data analysis (MTI / Extraction)",
                "Manual data checking",
                "Downstream processing",
                "Data Review (PCA, %RSD)",
                "Data export (.csv & .png)"
            ];
            const title = titles[parseInt(stepNum) - 1];
            
            // Set details
            detailTitle.textContent = `${stepNum}. ${title}`;
            detailDuration.textContent = duration;
            detailBody.textContent = details;
            
            // Show detail box
            detailBox.classList.remove('hidden');
        });
        
        node.addEventListener('mousemove', (e) => {
            // Position detail box relative to the mouse cursor inside the slide
            const rect = flowchartSection.getBoundingClientRect();
            const x = e.clientX - rect.left + 20; // 20px offset
            const y = e.clientY - rect.top - 40;
            
            detailBox.style.left = `${x}px`;
            detailBox.style.top = `${y}px`;
        });
        
        node.addEventListener('mouseleave', () => {
            detailBox.classList.add('hidden');
        });
    });
}

// --- Slide 16 Widget: Interactive Stacked Chromatograms ---

let chromScanInterval = null;
let chromScanActive = false;

// 13 MSI segments parameters: Migration Times (MT) in minutes
const msiSegments = [
    { id: 1, is1: 8.24, met: 8.44, is2: 9.08 },
    { id: 2, is1: 9.22, met: 9.42, is2: 10.06 },
    { id: 3, is1: 10.20, met: 10.40, is2: 11.04 },
    { id: 4, is1: 11.18, met: 11.38, is2: 12.02 },
    { id: 5, is1: 12.16, met: 12.36, is2: 13.00 },
    { id: 6, is1: 13.14, met: 13.34, is2: 13.98 },
    { id: 7, is1: 14.12, met: 14.32, is2: 14.96 },
    { id: 8, is1: 15.10, met: 15.30, is2: 15.94 },
    { id: 9, is1: 16.08, met: 16.28, is2: 16.92 },
    { id: 10, is1: 17.06, met: 17.26, is2: 17.90 },
    { id: 11, is1: 18.04, met: 18.24, is2: 18.88 },
    { id: 12, is1: 19.02, met: 19.22, is2: 19.86 },
    { id: 13, is1: 20.00, met: 20.20, is2: 20.84 }
];

// SVG Dimension mapping parameters
const svgWidth = 800;
const svgHeight = 140; // viewBox 800x140
const tMin = 6;
const tMax = 23;
const xStart = 50;
const xEnd = 780;
const yBaseline = 120;
const yPeakHeightMax = 95;

function timeToX(t) {
    return xStart + ((t - tMin) / (tMax - tMin)) * (xEnd - xStart);
}

function xToTime(x) {
    return tMin + ((x - xStart) / (xEnd - xStart)) * (tMax - tMin);
}

// Generate Gaussian Peak Y height (normalized)
function gaussianIntensity(t, center, sigma) {
    return Math.exp(-Math.pow(t - center, 2) / (2 * Math.pow(sigma, 2)));
}

// Generate baseline noise
function baselineNoise(t) {
    return 0.01 * Math.sin(t * 10) + 0.005 * Math.sin(t * 43) + 0.01;
}

// Draw entire chromatogram path summing Gaussians
function getChromatogramPathData(peaks, peakAmplitudes, sigma) {
    let points = [];
    const step = 0.05;
    for (let t = tMin; t <= tMax; t += step) {
        let intensity = baselineNoise(t);
        for (let i = 0; i < peaks.length; i++) {
            // Amplitude * Gaussian
            intensity += peakAmplitudes[i] * gaussianIntensity(t, peaks[i], sigma);
        }
        
        const x = timeToX(t);
        const y = yBaseline - intensity * yPeakHeightMax;
        points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return `M ${points.join(' L ')}`;
}

// Draw a single highlighted peak segment curve
function getSinglePeakPathData(center, amplitude, sigma) {
    let points = [];
    const step = 0.05;
    // Calculate only within 4 * sigma of center to draw localized peak
    const tStart = Math.max(tMin, center - 3 * sigma);
    const tEnd = Math.min(tMax, center + 3 * sigma);
    
    for (let t = tStart; t <= tEnd; t += step) {
        const intensity = amplitude * gaussianIntensity(t, center, sigma) + baselineNoise(t);
        const x = timeToX(t);
        const y = yBaseline - intensity * yPeakHeightMax;
        points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return `M ${points.join(' L ')}`;
}

function initChromatograms() {
    const svgIS1 = document.getElementById('svg-is1');
    const svgMet = document.getElementById('svg-met');
    const svgIS2 = document.getElementById('svg-is2');
    
    if (!svgIS1 || !svgMet || !svgIS2) return;
    
    // Clear old dynamic paths (keep axes and markers)
    const clearPaths = (svg) => {
        svg.querySelectorAll('.chrom-path-group').forEach(g => g.remove());
    };
    clearPaths(svgIS1);
    clearPaths(svgMet);
    clearPaths(svgIS2);
    
    // Build path groups
    const gIS1 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    gIS1.setAttribute('class', 'chrom-path-group');
    svgIS1.appendChild(gIS1);
    
    const gMet = document.createElementNS("http://www.w3.org/2000/svg", "g");
    gMet.setAttribute('class', 'chrom-path-group');
    svgMet.appendChild(gMet);
    
    const gIS2 = document.createElementNS("http://www.w3.org/2000/svg", "g");
    gIS2.setAttribute('class', 'chrom-path-group');
    svgIS2.appendChild(gIS2);
    
    // Set parameters
    const sigma = 0.12; // Peak width standard deviation
    
    // 1. IS1: Choline-d9 peaks (all identical amplitude ~0.9)
    const is1Peaks = msiSegments.map(s => s.is1);
    const is1Amps = msiSegments.map(() => 0.9);
    
    // 2. Met: Histidine peaks (varying amplitudes to look real: ~0.4 to ~0.8)
    const metPeaks = msiSegments.map(s => s.met);
    const metAmps = msiSegments.map((s, idx) => {
        // Make segment 3, 9, 10, 12, 13 look taller
        if (idx === 0) return 0.7;
        if (idx === 8 || idx === 9) return 0.82;
        if (idx === 11 || idx === 12) return 0.85;
        if (idx === 2) return 0.65;
        return 0.5 - (idx % 3) * 0.08;
    });
    
    // 3. IS2: GABA-d6 peaks (identical amplitude ~0.8)
    const is2Peaks = msiSegments.map(s => s.is2);
    const is2Amps = msiSegments.map(() => 0.8);
    
    // --- Draw baseline chromatograms ---
    
    // Get colors based on dark/light mode
    const isLightMode = document.body.classList.contains('light-mode');
    const baseColor = isLightMode ? 'rgba(0, 0, 0, 0.45)' : 'rgba(255, 255, 255, 0.45)';
    const strokeColorIS1 = isLightMode ? '#d97400' : '#ffa022'; // Orange
    const strokeColorMet = isLightMode ? '#9c27b0' : '#d28eff'; // Purple
    const strokeColorIS2 = isLightMode ? '#0076a3' : '#30a0ff'; // Blue
    
    // Base lines
    const pIS1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pIS1.setAttribute('d', getChromatogramPathData(is1Peaks, is1Amps, sigma));
    pIS1.setAttribute('class', 'chrom-peak-path');
    pIS1.setAttribute('stroke', baseColor);
    gIS1.appendChild(pIS1);
    
    const pMet = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pMet.setAttribute('d', getChromatogramPathData(metPeaks, metAmps, sigma));
    pMet.setAttribute('class', 'chrom-peak-path');
    pMet.setAttribute('stroke', baseColor);
    gMet.appendChild(pMet);
    
    const pIS2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
    pIS2.setAttribute('d', getChromatogramPathData(is2Peaks, is2Amps, sigma));
    pIS2.setAttribute('class', 'chrom-peak-path');
    pIS2.setAttribute('stroke', baseColor);
    gIS2.appendChild(pIS2);
    
    // --- Draw overlay segments for highlighting ---
    msiSegments.forEach((seg, idx) => {
        // Highlighted peak paths (drawn separately to color them individually on hover)
        const hIS1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        hIS1.setAttribute('d', getSinglePeakPathData(seg.is1, is1Amps[idx], sigma));
        hIS1.setAttribute('class', `chrom-peak-segment seg-${seg.id}`);
        hIS1.setAttribute('stroke', strokeColorIS1);
        gIS1.appendChild(hIS1);
        
        const hMet = document.createElementNS("http://www.w3.org/2000/svg", "path");
        hMet.setAttribute('d', getSinglePeakPathData(seg.met, metAmps[idx], sigma));
        hMet.setAttribute('class', `chrom-peak-segment seg-${seg.id}`);
        hMet.setAttribute('stroke', strokeColorMet);
        gMet.appendChild(hMet);
        
        const hIS2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
        hIS2.setAttribute('d', getSinglePeakPathData(seg.is2, is2Amps[idx], sigma));
        hIS2.setAttribute('class', `chrom-peak-segment seg-${seg.id}`);
        hIS2.setAttribute('stroke', strokeColorIS2);
        gIS2.appendChild(hIS2);
        
        // Add text labels over peak peaks in SVG
        const addPeakText = (svg, xVal, text) => {
            const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
            txt.setAttribute('x', xVal);
            txt.setAttribute('y', 16); // elevated above peak
            txt.setAttribute('class', `peak-num-label seg-${seg.id}`);
            txt.setAttribute('text-anchor', 'middle');
            txt.setAttribute('font-size', '10px');
            txt.setAttribute('font-weight', '600');
            txt.setAttribute('fill', isLightMode ? '#555' : '#aaa');
            txt.textContent = text;
            svg.appendChild(txt);
        };
        
        // Check which peaks are actually numbered in slide 16:
        // Choline-d9 has all 1-13 peaks numbered
        addPeakText(svgIS1, timeToX(seg.is1), seg.id);
        
        // Histidine has peaks 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
        // Peak 11, 12, 13 are visible.
        // We number all to make it complete and professional
        addPeakText(svgMet, timeToX(seg.met), seg.id);
        
        // GABA-d6 has all 1-13 peaks
        addPeakText(svgIS2, timeToX(seg.is2), seg.id);
    });
    
    // --- Mouse interaction listeners for Chart Panel ---
    const chartsPanel = document.querySelector('.charts-panel');
    const hoverLine = document.getElementById('chart-hover-line');
    const tooltip = document.getElementById('chart-hover-tooltip');
    const slide13 = document.getElementById('slide-19');
    
    if (!chartsPanel || !hoverLine || !tooltip || !slide13) return;
    
    // Define active segment tracker (default: 3)
    selectSegment(3);
    
    chartsPanel.addEventListener('mousemove', (e) => {
        stopChromatogramScanAnimation(); // stop automatic scan immediately
        const panelRect = chartsPanel.getBoundingClientRect();
        const containerRect = document.querySelector('.chromatogram-container').getBoundingClientRect();
        
        // X coord relative to the SVGs alignment
        const clientX = e.clientX;
        const xRel = clientX - containerRect.left;
        
        // Convert SVG X to Migration Time
        const tVal = xToTime(xRel);
        
        if (tVal < tMin || tVal > tMax) {
            hoverLine.classList.add('hidden');
            tooltip.classList.add('hidden');
            return;
        }
        
        // Position hover line
        const slideRect = slide13.getBoundingClientRect();
        hoverLine.style.left = `${clientX - slideRect.left}px`;
        hoverLine.classList.remove('hidden');
        
        // Find closest segment
        let closestSeg = msiSegments[0];
        let minDiff = Math.abs(tVal - closestSeg.met);
        
        for (let i = 1; i < msiSegments.length; i++) {
            const diff = Math.abs(tVal - msiSegments[i].met);
            if (diff < minDiff) {
                minDiff = diff;
                closestSeg = msiSegments[i];
            }
        }
        
        // Highlight this segment's peaks
        selectSegment(closestSeg.id);
        
        // Show tooltip
        tooltip.style.left = `${clientX - slideRect.left + 15}px`;
        tooltip.style.top = `${e.clientY - slideRect.top - 20}px`;
        tooltip.innerHTML = `
            <strong>Injection ${closestSeg.id}</strong><br/>
            MT<sub>Met</sub>: ${closestSeg.met.toFixed(2)} min<br/>
            MT<sub>IS1</sub>: ${closestSeg.is1.toFixed(2)} min<br/>
            MT<sub>IS2</sub>: ${closestSeg.is2.toFixed(2)} min
        `;
        tooltip.classList.remove('hidden');
    });
    
    chartsPanel.addEventListener('mouseleave', () => {
        hoverLine.classList.add('hidden');
        tooltip.classList.add('hidden');
        // Fall back to default selection injection 3
        selectSegment(3);
    });
}

function selectSegment(id) {
    // 1. Remove highlight class from all peak segments
    document.querySelectorAll('.chrom-peak-segment').forEach(path => {
        path.classList.remove('highlighted');
    });
    
    // 2. Add highlight class to matching segment elements
    document.querySelectorAll(`.chrom-peak-segment.seg-${id}`).forEach(path => {
        path.classList.add('highlighted');
    });
    
    // 3. Update active injection texts inside formulas
    const displayEl = document.getElementById('active-injection-display') || document.getElementById('active-segment-display');
    if (displayEl) displayEl.textContent = id;
    
    // Get values
    const segment = msiSegments.find(s => s.id === id);
    if (!segment) return;
    
    // Update elements dynamically only if they exist in the DOM
    const elMet = document.getElementById('val-met');
    const elIs1 = document.getElementById('val-is1');
    const elIs2 = document.getElementById('val-is2');
    const elResult = document.getElementById('val-result');
    
    if (elMet) elMet.textContent = `${segment.met.toFixed(2)} min`;
    if (elIs1) elIs1.textContent = `${segment.is1.toFixed(2)} min`;
    if (elIs2) elIs2.textContent = `${segment.is2.toFixed(2)} min`;
    
    // Compute MTI: (MT_Met - MT_IS1) / (MT_IS1 - MT_IS2)
    const num = segment.met - segment.is1;
    const den = segment.is1 - segment.is2;
    const mti = num / den;
    
    if (elResult) elResult.textContent = mti.toFixed(4);
}

function startChromatogramScanAnimation() {
    stopChromatogramScanAnimation(); // reset previous loop
    
    const chartsPanel = document.querySelector('.charts-panel');
    const hoverLine = document.getElementById('chart-hover-line');
    const tooltip = document.getElementById('chart-hover-tooltip');
    const slide11 = document.getElementById('slide-19');
    
    if (!chartsPanel || !hoverLine || !tooltip || !slide11) return;
    
    const container = document.querySelector('.chromatogram-container');
    if (!container) return;
    
    chromScanActive = true;
    
    // Scan time limits (corresponding to peak regions)
    let tVal = 7.5;
    const tEnd = 21.5;
    const step = 0.035;
    const speedMs = 70; // Slower interval for elegant scanning
    
    hoverLine.classList.remove('hidden');
    tooltip.classList.remove('hidden');
    
    chromScanInterval = setInterval(() => {
        if (!chromScanActive) return;
        
        tVal += step;
        if (tVal > tEnd) {
            tVal = 7.5; // loop back
        }
        
        const containerRect = container.getBoundingClientRect();
        const slideRect = slide11.getBoundingClientRect();
        
        // Calculate coordinate relative to slide container
        const xSvg = timeToX(tVal);
        const xPct = xSvg / 800;
        const xPixels = xPct * containerRect.width;
        const clientX = containerRect.left + xPixels;
        
        // Move hover line
        hoverLine.style.left = `${clientX - slideRect.left}px`;
        hoverLine.classList.remove('hidden');
        
        // Find closest injection
        let closestSeg = msiSegments[0];
        let minDiff = Math.abs(tVal - closestSeg.met);
        for (let i = 1; i < msiSegments.length; i++) {
            const diff = Math.abs(tVal - msiSegments[i].met);
            if (diff < minDiff) {
                minDiff = diff;
                closestSeg = msiSegments[i];
            }
        }
        
        // Update selection highlights and formula values
        selectSegment(closestSeg.id);
        
        // Position tooltip
        tooltip.style.left = `${clientX - slideRect.left + 15}px`;
        tooltip.style.top = `${containerRect.top - slideRect.top + containerRect.height / 2 - 40}px`;
        tooltip.innerHTML = `
            <strong>Injection ${closestSeg.id}</strong><br/>
            MT<sub>Met</sub>: ${closestSeg.met.toFixed(2)} min<br/>
            MT<sub>IS1</sub>: ${closestSeg.is1.toFixed(2)} min<br/>
            MT<sub>IS2</sub>: ${closestSeg.is2.toFixed(2)} min
        `;
        tooltip.classList.remove('hidden');
    }, speedMs);
}

function stopChromatogramScanAnimation() {
    chromScanActive = false;
    if (chromScanInterval) {
        clearInterval(chromScanInterval);
        chromScanInterval = null;
    }
}

// --- Flowchart Real-Time Simulation Loop ---
let flowchartSimInterval = null;
let flowchartSimTimeouts = [];

// Helper function to dynamically add active highlight glow to flowchart steps
function highlightSimStep(stepNum) {
    document.querySelectorAll('.flow-step-group').forEach(group => {
        group.classList.remove('sim-active');
    });
    if (stepNum) {
        const activeGroup = document.querySelector(`.flow-step-group[data-step="${stepNum}"]`);
        if (activeGroup) activeGroup.classList.add('sim-active');
    }
}

function startFlowchartSimulation() {
    // Clear any existing simulation first
    stopFlowchartSimulation();
    
    const particle = document.getElementById('flow-particle');
    if (!particle) return;
    
    // Path points in percentages: {x, y}
    const step1 = {x: 28.04, y: 5.47};
    const step2 = {x: 28.04, y: 20.52};
    const step3 = {x: 28.04, y: 35.57};
    const step4 = {x: 28.04, y: 50.62};
    const step5 = {x: 28.04, y: 65.66};
    const step6 = {x: 28.04, y: 80.71};
    const step7 = {x: 28.04, y: 95.76};
    
    // Diamonds for branching
    const diamond1 = {x: 87.23, y: 5.47};
    const diamond2 = {x: 87.23, y: 35.57};
    const diamond3 = {x: 87.23, y: 50.62};
    const diamond4 = {x: 87.23, y: 73.87};
    
    // Loop back path from step 3 to step 2
    const loopPath = [
        {x: 62.31, y: 35.57}, // go right
        {x: 62.31, y: 20.52}, // go up
        {x: 28.04, y: 20.52}, // go left (enters Step 2)
        step3                 // go down to Step 3
    ];
    
    let loopCounter = 0;
    
    function runSimulationStep() {
        // Reset particle position to start
        particle.style.transition = 'none';
        particle.style.opacity = '0';
        particle.style.left = `${step1.x}%`;
        particle.style.top = `${step1.y}%`;
        highlightSimStep(null);
        
        let delay = 100;
        
        // Helper to schedule transitions
        function moveTo(pt, durationMs, opacity = 1, stepToHighlight = null) {
            const t = setTimeout(() => {
                particle.style.transition = `left ${durationMs}ms linear, top ${durationMs}ms linear, opacity 200ms ease`;
                particle.style.opacity = opacity.toString();
                particle.style.left = `${pt.x}%`;
                particle.style.top = `${pt.y}%`;
                if (stepToHighlight !== null) {
                    highlightSimStep(stepToHighlight);
                }
            }, delay);
            flowchartSimTimeouts.push(t);
            delay += durationMs + 800; // Increased pause to 800ms
        }
        
        // 1. Start at Step 1 (show particle)
        moveTo(step1, 0, 1, 1);
        
        // Branch to Diamond 1
        const t1 = setTimeout(() => {
            spawnBranchParticle(step1, diamond1);
        }, delay);
        flowchartSimTimeouts.push(t1);
        
        // 2. Move to Step 2
        moveTo(step2, 1000, 1, 2);
        
        // 3. Move to Step 3
        moveTo(step3, 1000, 1, 3);
        
        // Branch to Diamond 2
        const t2 = setTimeout(() => {
            spawnBranchParticle(step3, diamond2);
        }, delay);
        flowchartSimTimeouts.push(t2);
        
        // Decision: loop back or continue?
        loopCounter++;
        if (loopCounter % 2 === 0) {
            // Loop back: step 3 -> loopPath[0] -> loopPath[1] -> loopPath[2] -> loopPath[3]
            moveTo(loopPath[0], 700, 1, 0); // go right, clear highlight
            moveTo(loopPath[1], 900, 1, 0); // go up
            moveTo(loopPath[2], 700, 1, 2); // go left to enter Step 2
            moveTo(loopPath[3], 1000, 1, 3); // go down to Step 3
            
            // Branch to Diamond 2 again on second visit
            const t2_2 = setTimeout(() => {
                spawnBranchParticle(step3, diamond2);
            }, delay);
            flowchartSimTimeouts.push(t2_2);
        }
        
        // 4. Move to Step 4
        moveTo(step4, 1000, 1, 4);
        
        // Branch to Diamond 3
        const t3 = setTimeout(() => {
            spawnBranchParticle(step4, diamond3);
        }, delay);
        flowchartSimTimeouts.push(t3);
        
        // 5. Move to Step 5
        moveTo(step5, 1000, 1, 5);
        
        // Branch to Diamond 4 (bracket top)
        const t4 = setTimeout(() => {
            spawnBranchParticle({x: 56.07, y: 48.0}, diamond4);
        }, delay);
        flowchartSimTimeouts.push(t4);
        
        // 6. Move to Step 6
        moveTo(step6, 1000, 1, 6);
        
        // Branch to Diamond 4 (bracket bottom)
        const t5 = setTimeout(() => {
            spawnBranchParticle({x: 56.07, y: 59.0}, diamond4);
        }, delay);
        flowchartSimTimeouts.push(t5);
        
        // 7. Move to Step 7
        moveTo(step7, 1000, 1, 7);
        
        // Fade out at end
        moveTo(step7, 100, 0, 0);
        
        // Restart loop after total delay
        const restartTimer = setTimeout(() => {
            runSimulationStep();
        }, delay);
        flowchartSimTimeouts.push(restartTimer);
    }
    
    // Spawn secondary glowing particle that moves to the side diamond and fades out
    function spawnBranchParticle(startPt, endPt) {
        const wrapper = document.querySelector('.flowchart-wrapper');
        if (!wrapper) return;
        
        const branchParticle = document.createElement('div');
        branchParticle.className = 'flow-particle-branch';
        branchParticle.style.position = 'absolute';
        branchParticle.style.width = '8px';
        branchParticle.style.height = '8px';
        branchParticle.style.borderRadius = '50%';
        branchParticle.style.backgroundColor = 'var(--accent-purple)';
        branchParticle.style.boxShadow = '0 0 6px var(--accent-purple), 0 0 12px var(--accent-purple)';
        branchParticle.style.pointerEvents = 'none';
        branchParticle.style.zIndex = '4';
        branchParticle.style.left = `${startPt.x}%`;
        branchParticle.style.top = `${startPt.y}%`;
        branchParticle.style.opacity = '1';
        branchParticle.style.transition = 'left 1000ms ease-out, top 1000ms ease-out, opacity 1000ms ease-out';
        
        wrapper.appendChild(branchParticle);
        
        // Animate
        setTimeout(() => {
            branchParticle.style.left = `${endPt.x}%`;
            branchParticle.style.top = `${endPt.y}%`;
            branchParticle.style.opacity = '0';
        }, 50);
        
        // Clean up
        setTimeout(() => {
            branchParticle.remove();
        }, 1100);
    }
    
    // Kick off first run
    runSimulationStep();
}

function stopFlowchartSimulation() {
    // Clear timeouts
    flowchartSimTimeouts.forEach(t => clearTimeout(t));
    flowchartSimTimeouts = [];
    
    // Remove any leftover branch particles
    document.querySelectorAll('.flow-particle-branch').forEach(p => p.remove());
    
    // Reset main particle opacity
    const particle = document.getElementById('flow-particle');
    if (particle) {
        particle.style.opacity = '0';
    }

    // Clean active highlights
    highlightSimStep(null);
}
