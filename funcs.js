const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = "Thuc_PLAYER"

const cd = $('.cd')
const heading = $('header .song-name')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const preBtn = $('.btn-prev')
const nextBtn = $('.btn-next')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')




audio.setAttribute('crossorigin', 'anonymous');
const app = {
    currentIndex: 0,
    isPlaying : false,
    isRandom : false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs:[
        {
            name: "Under The Influence",
            singer: "Chris Brown",
            path: "assets/musics/Chris Brown - Under The Influence (Lyrics).mp3",
            image: "assets/images/1.jpg"
          },
          {
            name: "Ôm Trọn Nỗi Nhớ",
            singer: "RUM",
            path: "assets/musics/RUM - Ôm Trọn Nỗi Nhớ _ Lyric Video.mp3",
            image:
              "assets/images/omtronnoinho.jpg"
          },
          {
            name: "Có Được Không Em",
            singer: "Chi Dân",
            path:
              "assets/musics/CHI DÂN _ CÓ ĐƯỢC KHÔNG EM _ LYRICS VIDEO _ CHI DÂN OFFICIAL.mp3",
            image: "assets/images/Coduockhongem.jpg"
          },
          {
            name: "Anh Đã Quen Với Cô Đơn ",
            singer: "Soobin Hoàng Sơn",
            path: "assets/musics/Anh Đã Quen Với Cô Đơn - Soobin Hoàng Sơn _ Official Music Video 4K.mp3",
            image:
              "assets/images/anhdaquenvoicodon.jpg"
          },
          {
            name: "Dành Cho Em",
            singer: "Hoàng Tôn",
            path: "assets/musics/Dành Cho Em.mp3",
            image:
              "assets/images/danhchoem.jpg"
          },
          {
            name: "Chăm Hoa",
            singer: "MONO",
            path:
              "assets/musics/MONO - 'Chăm Hoa' (Official Music Video).mp3",
            image:
            "assets/images/chamhoa.jpg",          },
          {
            name: "Sẽ Không Còn Nữa",
            singer: "Tuấn Hưng",
            path: "assets/musics/Sẽ Không Còn Nữa - Tuấn Hưng.mp3",
            image:
              "assets/images/sekhongconnua.jpg"
          }
    ],
    setConfig: function(key,value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },

    //1. render song
    render: function(){
        const htmls = this.songs.map((song , index) =>{
            return `
                 <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}" >
                    <div class="thumb"
                        style="background-image: url('${song.image}')">
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
        })
        playlist.innerHTML = htmls.join('');
    },

    defineProperties:function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },

    //2. scrollTop
    //3 . Play , pause , seek
    //4. CD rotate
    //5.preSong, nextSong
    //6.Random
    //7.repeat/next when song end
    //8.active song
    //9.play song when click
    //10. save in local storage
    handleEvents: function(){
        const cdWidth = cd.offsetWidth
        const _this = this

        //xu ly cd quay va dung
        const cdThumbAnimate =  cdThumb.animate([
            { transform: 'rotate(360deg)' }     
        ],{
            duration: 10000,
            iterations: Infinity //lap vo han
        })
        cdThumbAnimate.pause();
        

        //xu ly phong to thu nho CD
        document.onscroll = function(){
            const scrollTop = window.scrollY|| document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
          
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0 ;
            cd.style.opacity = newCdWidth/cdWidth;
        }   

        //xu ly khi click play

        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause();
            }
            else{
                audio.play();
            }
            //khi bai hat duoc play
            audio.onplay = function(){
                _this.isPlaying = true;
                player.classList.add('playing');
                cdThumbAnimate.play();
            }

            //khi bai hat bi dung
            audio.onpause = function(){
                _this.isPlaying = false;
                player.classList.remove('playing');
                cdThumbAnimate.pause();
            }

            //khi tien do bai hat thay doi
            audio.ontimeupdate = function(){
                if(audio.duration){
                    const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                    progress.value = progressPercent;
                }
            }

            //xu ly khi tua bai hat
            progress.onchange = function(e){
                const seekTime = audio.duration / 100 * e.target.value;
                audio.currentTime = seekTime;
            }
        }
        
        //khi next song
         nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }
            else{
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
         }
         //khi previous song
         preBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandomSong();
            }
            else{
                _this.preSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
         }

         //xu ly bat / tat random song
         randomBtn.onclick = function(e){
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom' , _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
         }

          //repeat Song
          repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat' , _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
         }
         
         //xu ly sau khi song end
         audio.onended = function(){
            if(_this.isRepeat){
                audio.play();
            }
            else{
                nextBtn.click();
            }
         }

         //lang nghe hanh vi click vao play list
         playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active')

            if(songNode || e.target.closest('.option')){
                //xu ly khi click vao song
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                    
                }
                //xu ly khi click vao option
                if(e.target.closest('.option')){

                }
            }
         }
    },

    scrollToActiveSong: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
            })
        },500)
    },

    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path; 
    },
    
    loadConfig: function(){
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
    },
    
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    preSong: function(){
        this.currentIndex--;
        if(this.currentIndex <= 0){
            this.currentIndex = this.songs.length -1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function(){
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function(){
        //gán cấu từ config vào ứng dụng
        this.loadConfig();
        //định nghĩa các thuộc tính cho object
        this.defineProperties();

        //lắng nghe / xử lý sự kiện cho DOM events
        this.handleEvents();

        //Tai thong tin bai haty dau tien vao UI khi chay ung dung
        this.loadCurrentSong();

        //Render playlist
        this.render();

        //hiển thị trạng thái ban đầu của btn repeat & random
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
    }   

}

app.start();