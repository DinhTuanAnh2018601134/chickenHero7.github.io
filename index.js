const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'SUNDAY_PLAYER';

const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const playlist = $('.playlist');
const playBtn = $('.btn-toggle-play');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const player = $('.player');
const progress = $('#progress');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Sao Cũng Được',
            singer: 'Binz',
            path: 'https://mp3-320s1-zmp3.zadn.vn/ca7f7f57a913404d1902/7573974072711764367?authen=exp=1633273711~acl=/ca7f7f57a913404d1902/*~hmac=8849714dcfd8bb03e886817c450a4a6e&fs=MTYzMzEwMDkxMTU0N3x3ZWJWNnwxMDI1OTUyNDY0fDI3LjmUsICxLjg0LjIwNw',
            image: 'https://photo-resize-zmp3.zadn.vn/w320_r1x1_png/covers/6/d/6d51904d4f03ee29a9e9164e3036857f_1520665277.png'
        },
        {
            name: 'Em Không Sai Chúng Ta Sai',
            singer: 'Erik',
            path: 'https://mp3-320s1-zmp3.zadn.vn/1fef1cb50cf2e5acbce3/3770092767617317826?authen=exp=1633273695~acl=/1fef1cb50cf2e5acbce3/*~hmac=9d006c1096ca084d0c2be8ea1cfe2a1b&fs=MTYzMzEwMDg5NTEzNnx3ZWJWNnwwfDE0LjI1Mi4xMzQdUngODA',
            image: 'https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/7/4/0/d/740d5e0fd272d2421d441e9fd5c08fdd.jpg'
        },
        {
            name: 'Kẻ Điên Tin Vào Tình Yêu',
            singer: 'Lil Z',
            path: 'https://mp3-320s1-zmp3.zadn.vn/38ec18adbeea57b40efb/129469551492633918?authen=exp=1633273397~acl=/38ec18adbeea57b40efb/*~hmac=70cafa7cf6ad070f548833563829e9f2&fs=MTYzMzEwMDU5Nzk0MHx3ZWJWNnwwfDExNS43NS41NC4yMDU',
            image: 'https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/6/9/f/6/69f621e3a5655a7c984664e893af70ab.jpg'
        },
        {
            name: 'Bông Hoa Đẹp Nhất',
            singer: 'Quân A.P',
            path: 'https://mp3-320s1-zmp3.zadn.vn/49b21e374570ac2ef561/1499359916863826054?authen=exp=1633273461~acl=/49b21e374570ac2ef561/*~hmac=1069f85815f3c419188c422f5186ea4a&fs=MTYzMzEwMDY2MTQ5N3x3ZWJWNnwwfDE0LjE4Ni42OC4xNjY',
            image: 'https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/f/8/1/e/f81efd92fa9a3d52eb37f3b867ab9d32.jpg'
        },
        {
            name: 'Đánh Mất Em',
            singer: 'QDT',
            path: 'https://mp3-320s1-zmp3.zadn.vn/9d2e24a56ce285bcdcf3/500599824594930489?authen=exp=1633273682~acl=/9d2e24a56ce285bcdcf3/*~hmac=39d75007942efa05ca5e5213c33cc46e&fs=MTYzMzEwMDg4Mjg4NHx3ZWJWNnwxMDIyNzQ1NzU3fDQyLjExOC4xMTIdUngMjQ0',
            image: 'https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/8/3/6/9/83690ac46c2ba7cf46b153e6226c974d.jpg'
        },
    ],
    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active': ''}" data-index=${index}>
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        });
        playlist.innerHTML = htmls.join('');
    },
    defineProperties : function () {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function() {
        const cdWith = cd.offsetWidth;
        const song = $$('.song');

        //xu ly cd quay va dung
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg'}
        ],{
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        //xu ly phong to/thu nho cd
        document.onscroll = function() {
            const scrollY = window.scrollY;
            const newCdWidth = cdWith - scrollY;
            cd.style.width = newCdWidth > 0 ? newCdWidth +'px' : 0;
            cd.style.opacity = newCdWidth/cdWith;
        }

        //xu ly khi click play
        playBtn.onclick = function() {
            if(app.isPlaying){
                audio.pause();
            }
            else{
                audio.play();
            }
        }
        //khi song duoc play
        audio.onplay = function() {
            app.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        //khi song duoc pause
        audio.onpause = function() {
            app.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }
        //khi tien do bai hat thay doi
        audio.ontimeupdate = function() {
            if(audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }
        //khi tua song
        progress.onchange = function(event) {
            const seekTime = audio.duration * event.target.value / 100;
            audio.currentTime = seekTime;
        }
        //khi next song
        nextBtn.onclick = function() {
            if(app.isRandom){
                app.playRandom();
            }
            else{
                app.nextSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }
        //khi prev song
        prevBtn.onclick = function() {
            if(app.isRandom){
                app.playRandom();
            }
            else{
                app.prevSong();
            }
            audio.play();
            app.render();
            app.scrollToActiveSong();
        }
        //khi random
        randomBtn.onclick = function() {
            app.isRandom = !app.isRandom
            app.setConfig('isRandom', app.isRandom);
            this.classList.toggle('active',app.isRandom);
        }
        //xu ly repeat song
        repeatBtn.onclick = function() {
            app.isRepeat = !app.isRepeat;
            app.setConfig('isRepeat', app.isRepeat);
            this.classList.toggle('active',app.isRepeat);
        }
        //xu ly next khi audio ended
        audio.onended = function() {
            if(app.isRepeat){
                audio.play();
            }
            else{
                nextBtn.click();
            }
        }
        //xu ly click vao playlist
        playlist.onclick = function(event) {
            const songNode = event.target.closest('.song:not(.active)');
            if(songNode || event.target.closest('.option')){
                //xu ly khi click vao song
                if(songNode){
                    app.currentIndex = Number(songNode.dataset.index);
                    app.loadCurrentSong();
                    app.render();
                    audio.play();
                }
            }
        }
    },
    //xu ly song active
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }, 300)
    },
    loadConfig: function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    loadCurrentSong : function() {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length -1;
        }
        this.loadCurrentSong();
    },
    playRandom: function() {
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while(newIndex === this.currentIndex)
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function() {
        //gan cau hinh tu config vao app
        this.loadConfig();

        //dinh nghia cac thuoc tinh object
        this.defineProperties()

        //xu ly cac sukien
        this.handleEvents();

        //load thong tin bai hat dau vao ui
        this.loadCurrentSong();

        //render playlist
        this.render();

        //hien thi trang thai ban dau cua btn repeat va random
        randomBtn.classList.toggle('active',this.isRandom);
        repeatBtn.classList.toggle('active',this.isRepeat);
    }
}

app.start();
