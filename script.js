document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("overlay");
    const darken = document.getElementById("overlay-darken") || document.querySelector('.overlay-darken');
    const fatalError = document.getElementById("fatal-error");
    const logStream = document.getElementById("log-stream");
    const bgAudio = document.getElementById("bg-audio");
    const mAudio = document.getElementById("m-audio");
    const zAudio = document.getElementById("z-audio");
    const crashArtifacts = document.getElementById("crash-artifacts");
    const crashVideoContainer = document.getElementById("crash-video-container");
    const crashVideo = document.getElementById("crash-video");
    const crashVideoAudio = document.getElementById("crash-video-audio");
    const aloneScreen = document.getElementById("alone-screen");
    const responseText = document.getElementById("response-text");
    const yesBtn = document.getElementById("yes-btn");
    const noBtn = document.getElementById("no-btn");

    // Arkaplan sesi başlat (videoların sesi açılmadıkça loop)
    if (bgAudio) {
        bgAudio.volume = 0.3;
        bgAudio.play().catch(() => {});
    }
    const logMessages = [
        "> BYPASSING_FIREWALL...", "> ACCESSING_ROOT...", "> DOWNLOADING_KEYLOGS...",
        "> SENDING_DATA_TO_EXTERNAL_SERVER...", "> ENCRYPTING_DRIVE_C...", "> DISABLING_ANTIVIRUS..."
    ];

    if (logStream) {
        setInterval(() => {
            const p = document.createElement('p');
            p.textContent = logMessages[Math.floor(Math.random() * logMessages.length)];
            logStream.appendChild(p);
            if (logStream.childNodes.length > 5) logStream.removeChild(logStream.firstChild);
        }, 3000);
    }

    // Güvenlik: eksik elemanlara karşı filtreli node dizisi
    const nodes = [
        { el: document.getElementById("node-1"), vid: document.getElementById("vid1"), lock: document.getElementById("lock-1"), text: document.getElementById("text-1") },
        { el: document.getElementById("node-4"), vid: document.getElementById("vid4"), lock: document.getElementById("lock-4"), text: document.getElementById("text-4") },
        { el: document.getElementById("node-3"), vid: document.getElementById("vid3"), lock: document.getElementById("lock-3"), text: document.getElementById("text-3") },
        { el: document.getElementById("node-2"), vid: document.getElementById("vid2"), lock: document.getElementById("lock-2"), text: document.getElementById("text-2") }
    ].filter(n => n.el && n.vid && n.lock && n.text);

    overlay && overlay.addEventListener("click", () => {
        overlay.style.display = "none";
        // İlk tıklamada sesleri etkinleştir
        nodes.forEach(n => { try { n.vid.volume = 1.0; } catch(e){} });
        // İlk aktif node'yu güvenli olarak işaretle
        nodes[0] && nodes[0].el && nodes[0].el.classList.add('active');
        // Tam ekran yap
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(err => {});
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
    });

    nodes.forEach((node, index) => {
        node.el.addEventListener('click', () => {
            // Sadece aktif ve daha önce oynatılmamışsa oynat
            if (node.el.classList.contains('active') && !node.el.classList.contains('expanded') && !node.el.classList.contains('played')) {
                expandAndPlay(node);
            }
        });

        node.vid.addEventListener('ended', () => {
            shrinkAndNext(node, index);
        });
    });

    function expandAndPlay(node) {
        node.el.classList.add('expanded');
        document.body.classList.add('shake');

        // Tüm sesleri durdur
        if (bgAudio) {
            bgAudio.pause();
        }
        if (mAudio) {
            mAudio.pause();
        }

        node.vid.volume = 1.0;
        node.vid.play().catch(e => {
            console.log('Video oynatılamadı:', e);
            // Hata durumunda kullanıcıya görsel bildirim bırak
            alert('CRITICAL_ERROR: DATA_CORRUPTION_IN_SECTOR_0x' + Math.random().toString(16).slice(2,8));
            shrinkAndNext(node, nodes.indexOf(node));
        });
    }

    function shrinkAndNext(node, index) {
        node.el.classList.remove('expanded');
        document.body.classList.remove('shake');

        // Show base64 text and mark as played for all videos
        node.text && node.text.classList.remove('hidden');
        node.lock && (node.lock.innerHTML = '🔓 DECRYPTED');
        node.el.classList.add('played');
        try { node.vid.pause(); node.vid.currentTime = 0; node.vid.style.display = 'none'; } catch(e){}

        // Video 1 (index 0) ve Video 2 (index 1): n.mp3'ü resume et
        if (index === 0 || index === 1) {
            if (bgAudio) {
                bgAudio.volume = 0.3;
                bgAudio.play().catch(() => {});
            }
        }

        // Video 3 (index 2): n.mp3'ü durdur, m.mp3'ü başlat
        if (index === 2) {
            if (bgAudio) bgAudio.pause();
            if (mAudio) {
                mAudio.volume = 0.4;
                mAudio.play().catch(() => {});
            }
        }

        // Video 4 (index 3): Trigger crash sequence
        if (index === 3) {
            triggerCrashSequence();
            return;
        }

        if (index + 1 < nodes.length) {
            const next = nodes[index + 1];
            next.el.classList.remove('locked');
            next.el.classList.add('active');
            next.lock && (next.lock.innerHTML = '🔒 READY');
        } else {
            triggerFinalDoom();
        }
    }

    function triggerCrashSequence() {
        // Stop all audio
        if (bgAudio) bgAudio.pause();
        if (mAudio) mAudio.pause();

        // 2 seconds: Show crash video fullscreen and play z.mp3 and video audio
        setTimeout(() => {
            if (crashVideoContainer) {
                crashVideoContainer.classList.remove('hidden');
            }
            if (crashVideo) {
                crashVideo.play().catch(() => {});
            }
            if (crashVideoAudio) {
                crashVideoAudio.volume = 1.0;
                crashVideoAudio.play().catch(() => {});
            }
            if (zAudio) {
                zAudio.volume = 0.5;
                zAudio.play().catch(() => {});
            }
        }, 2000);

        // 7 seconds: Show critical system error
        setTimeout(() => {
            if (fatalError) {
                fatalError.style.display = 'flex';
            }
        }, 7000);

        // 12 seconds: Hide error and show ARE YOU ALONE screen
        setTimeout(() => {
            if (zAudio) zAudio.pause();
            if (crashVideoAudio) crashVideoAudio.pause();
            if (crashVideoContainer) crashVideoContainer.classList.add('hidden');
            if (fatalError) fatalError.style.display = 'none';
            showAloneScreen();
        }, 12000);
    }

    function showAloneScreen() {
        // Black screen for 2 seconds, then show ARE YOU ALONE
        if (aloneScreen) {
            aloneScreen.classList.remove('hidden');
            aloneScreen.classList.add('visible');
        }
    }

    // ARE YOU ALONE button handlers
    if (yesBtn) {
        yesBtn.addEventListener('click', () => {
            yesBtn.style.display = 'none';
            noBtn.style.display = 'none';
            responseText.textContent = "Your loneliness saddens me... let me change that :)";
            responseText.classList.remove('hidden');
            setTimeout(() => {
                window.location.href = 'about:blank';
            }, 4000);
        });
    }

    if (noBtn) {
        noBtn.addEventListener('click', () => {
            yesBtn.style.display = 'none';
            noBtn.style.display = 'none';
            responseText.textContent = "I knew... I liked that you accepted me so quickly :)";
            responseText.classList.remove('hidden');
            setTimeout(() => {
                window.location.href = 'about:blank';
            }, 4000);
        });
    }

    // expose for debugging
    window.triggerFinalDoom = triggerFinalDoom;
});