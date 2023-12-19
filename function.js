const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const preBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist")
const PLAYER_STORAGE_KEY = "MINH_DUC";


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Anh da on hon',
            singer: 'MCK',
            path: 'assets/music/AnhDaOnHon.mp3',
            image: 'assets/images/AnhDaOnHon.jpg'
        },
        {
            name: 'Anh van luon nhu vay',
            singer: 'Bray',
            path: 'assets/music/AnhVanLuonNhuVay.mp3',
            image: 'assets/images/AnhVanLuonNhuVay.jpg'
        },
        {
            name: 'Du tien',
            singer: 'Bray',
            path: 'assets/music/DuTien.mp3',
            image: 'assets/images/DuTien.jpg'
        },
        {
            name: 'Con trai cung',
            singer: 'Bray',
            path: 'assets/music/ConTraiCung.mp3',
            image: 'assets/images/ConTraiCung.jpg'
        },
        {
            name: 'Do for love',
            singer: 'Bray',
            path: 'assets/music/DoForLove.mp3',
            image: 'assets/images/DoForLove.jpg'
        },
        {
            name: 'Ex Hate Me 2',
            singer: 'Bray',
            path: 'assets/music/ExHateMePart2.mp3',
            image: 'assets/images/ExHateMe2.jpg'
        },
        {
            name: 'Con gai ruou',
            singer: 'Bray',
            path: 'assets/music/ConGaiRuou.mp3',
            image: 'assets/images/ConGaiRuou.jpg'
        },
        {
            name: 'Way back home',
            singer: 'Bray',
            path: 'assets/music/WayBackHome.mp3',
            image: 'assets/images/WayBackHome.jpg'
        },
        {
            name: 'Anh nha o dau the',
            singer: 'Bray',
            path: 'assets/music/AnhNhaODauThe.mp3',
            image: 'assets/images/AnhNhaODauThe.jpg'
        },
        {
            name: 'Ex Hate Me',
            singer: 'Bray',
            path: 'assets/music/ExHateMe.mp3',
            image: 'assets/images/ExHateMe.jpg'
        },
    ],
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" style="background-image: url('${song.image}')"></div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join("")
    },
    //define current song
    defineProperties: function () {
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function () {
        //rotate CD
        const cdThumpAnimate = cdThumb.animate([
            {
                transform: "rotate(360deg)"
            }
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumpAnimate.pause();
        //zoom in/out CD
        const cdWidth = cd.offsetWidth
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        //click
        playBtn.onclick = function () {
            if (app.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
            //play
            audio.onplay = function () {
                app.isPlaying = true;
                player.classList.add("playing");
                cdThumpAnimate.play();
            }
            //pause
            audio.onpause = function () {
                app.isPlaying = false;
                player.classList.remove("playing");
                cdThumpAnimate.pause();
            }
            //progress bar is increase
            audio.ontimeupdate = function () {
                const progressPercent = (audio.currentTime / audio.duration) * 100;
                progress.value = progressPercent;
            }
        }
        //seeking the time on progress bar
        progress.addEventListener("mousedown", function (e) {
            const boundingRect = progress.getBoundingClientRect();
            const percent = (e.clientX - boundingRect.left) / boundingRect.width;
            const seekTime = audio.duration * percent;
            audio.currentTime = seekTime;
        });
        //next song
        nextBtn.onclick = function () {
            if (app.isRandom) {
                app.randomSong();
            } else {
                app.nextSong();
            }
            audio.play();
            app.render();
            app.highlightCurrentSong();
        }
        //previous song
        preBtn.onclick = function () {
            if (app.isRandom) {
                app.randomSong();
            } else {
                app.preSong();
            }
            audio.play();
            app.render();
            app.highlightCurrentSong();
        }
        //auto go on next song
        audio.onended = function () {
            if (app.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }
            app.render();
        }
        //random song
        randomBtn.onclick = function () {
            app.isRandom = !app.isRandom;
            app.setConfig("isRandom", app.isRandom);
            randomBtn.classList.toggle('active', app.isRandom);
        },
            //repeat the song
            repeatBtn.onclick = function () {
                app.isRepeat = !app.isRepeat;
                app.setConfig("isRepeat", app.isRepeat);
                repeatBtn.classList.toggle('active', app.isRepeat);
            }
        //go for the song in list 
        playlist.onclick = function (e) {
            if (e.target.closest('.song:not(.active)')) {
                app.currentIndex = Number(e.target.closest('.song:not(.active)').dataset.index);
                app.loadCurrentSong();
                app.render();
                audio.play();
            }
            if (e.target.closest('.option')) {

            }
        }

    },
    //scroll to the active song
    highlightCurrentSong: function () {
        setTimeout(() => {
            $(".song.active").scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        }, 300)
    },
    //load song on songs list  
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom
        this.isRandom = this.config.isRepeat
    },
    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }

        this.loadCurrentSong();
    },
    preSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }

        this.loadCurrentSong();
    },
    randomSong: function () {
        let remainingSongs = this.songs.filter((song, index) => index !== this.currentIndex);
        if (remainingSongs.length > 0) {
            const newIndex = Math.floor(Math.random() * remainingSongs.length);
            this.currentIndex = this.songs.indexOf(remainingSongs[newIndex]);
        } else {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    start: function () {
        this.loadConfig();
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
        this.render();

        repeatBtn.classList.toggle('active', app.isRepeat);
        randomBtn.classList.toggle('active', app.isRandom);
    }
}
app.start();
