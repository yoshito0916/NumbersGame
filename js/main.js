'use strict';

{
    class Panel {
      constructor(game) {
        this.game = game;
        this.el = document.createElement('li');
        this.el.classList.add('pressed');
        this.el.addEventListener('click', () => {
          this.check();
        });
      }
  
      getEL() { 
        return this.el;
      }

      activate(num) {
        this.el.classList.remove('pressed');
        this.el.textContent = num;
      }
  
      check() {
        if (this.game.getCurrentNum() === parseInt(this.el.textContent, 10)) {
          this.el.classList.add('pressed');
          this.game.addCurrentNum();
       
          if (this.game.getCurrentNum() === this.game.getLevel() ** 2) {
            clearTimeout(this.game.getTimeoutId());
          }
        }
      }
    }
  
    class Board {
      constructor(game) {
        this.game = game;
        this.panels = []; 
        for (let i = 0; i < this.game.getLevel() ** 2; i++) {  
          this.panels.push(new Panel(this.game));
        }
        this.setup();
      }
      setup() {
        const board = document.getElementById('board');
        this.panels.forEach(panel => {
         
          board.appendChild(panel.getEL()); 
        });
      }
  
      activate() {
        const nums = [];
        for (let i = 0; i < this.game.getLevel() ** 2; i++) {
          nums.push(i);
        }
        this.panels.forEach(panel => {
          const num = nums.splice(Math.floor(Math.random() * nums.length), 1)[0];
          panel.activate(num);
        });
      }
    }
  
    class Game {
      constructor(level) {
        this.level = level;
        this.board = new Board(this);
  
        this.currentNum = undefined;
        this.startTime = undefined;
        this.timeoutId = undefined;
        
        const btn = document.getElementById('btn');
        btn.addEventListener('click', () => {
          this.start();
        });
        this.setup();
      }
  
      setup() {
        const container = document.getElementById('container');
        const PANEL_WIDTH = 50;
        const BOARD_PADDING = 10;
        /*   50px * 2 + 10px * 2   */
        container.style.width = PANEL_WIDTH * this.level + BOARD_PADDING * 2 + 'px';
      }
  
      start() {
        if (typeof this.timeoutId !== 'undefined') {
          clearTimeout(this.timeoutId);
        }
  
        this.currentNum = 0;
        this.board.activate();
  
        this.startTime = Date.now();
        this.runTimer();
      }
  
      runTimer() {
        const timer = document.getElementById('timer');
        timer.textContent = ((Date.now() - this.startTime) / 1000).toFixed(2);
  

        this.timeoutId = setTimeout(() => { 
          this.runTimer();
        }, 10);
      }
  
      addCurrentNum() {
        this.currentNum++;
      }
  
      getCurrentNum() {
        return this.currentNum;
      }
  
      getTimeoutId() {
        return this.timeoutId;
      }
  
      getLevel() {
        return this.level;
      }
    }
    
    new Game(5);
  }  


// {
// //ゲームの最初ではパネルは数字がない状態でpressedクラスがついているので、そういったli要素を作ってあげる。li要素をプロパティとして持たせたいので、プロパティ名はelementのelとしつつdocument.createElement('li')とする。pressedクラスがついていたのでclassListを使ってclassList.add('pressed')と設定する。これでpressedクラスのついたli要素を４つ持つボードができた

//   class Panel {
//     constructor(game) {
//       this.game = game;
//       this.el = document.createElement('li');
//       this.el.classList.add('pressed');
//       this.el.addEventListener('click', () => {
//         this.check();
//       });
//     }

//     getEL() { //注２  ここで単にelプロパティを返せば良い。return this.elとする。
//       return this.el;
//     }
// //panelクラスの方でもactivate()メソッドを作ってあげる。パネルに配置する数値が渡ってくるので、とりあえずnumという引数で受けてあげる。書き方はパネルからpressedクラスをとりあえず外したいのでclassListを使ってclasslist.remove('pressed')としてあげる。あとはli要素にnumをセットしたいのでtextContentをnumで設定する
//     activate(num) {
//       this.el.classList.remove('pressed');
//       this.el.textContent = num;
//     }

//     check() {
//       if (this.game.getCurrentNum() === parseInt(this.el.textContent, 10)) {//currentNumと押し込んだ数値があっているかを比較したいが、this.el.textContentは文字列なのでparseInt()で数値にしてあげてから比較する。一致していたら押し込めるようにする。pressedクラスを付けて次の数値を選べるようにcurrentNumを１増やしてあげれば良い。
//         this.el.classList.add('pressed');
//         this.game.addCurrentNum();
//       //全部のパネルを押し込んだ時にタイマーを止めるためcheck()の中でcurrentNumを更新した後に条件分岐してあげる。currentNumが4だったらタイマーを止めるように書く
//         if (this.game.getCurrentNum() === this.game.getLevel() ** 2) {
//           clearTimeout(this.game.getTimeoutId());
//         }
//       }
//     }
//   }

//   class Board {
//     constructor(game) {
//       this.game = game;
//       this.panels = []; //空の配列
//       for (let i = 0; i < this.game.getLevel() ** 2; i++) {  //パネルを４枚作りたいのでループを回す
//         this.panels.push(new Panel(this.game));
//       }
//       this.setup();//Boardクラスにsetup()というメソッドを作って、コンストラクターの方で呼び出すだけにする
//     }
//     setup() {
//       const board = document.getElementById('board');//まずboard要素を取得する。setup()の中でしか使わないので、プロパティにする必要はない。constで定数で宣言する。その上でpanelsの数だけ要素を追加していけばいいのでforEach()を使ってあげればいい。一つ一つの要素をpanelとしつつ、boardに対してappendChild()してあげれば良い。
//       this.panels.forEach(panel => {
//         //  board.appendChild(panel.el);注
//         //今回追加するのはli要素なのでpanelのelプロパティを追加してあげれば良いのだが、実はクラスのプロパティに外部から直接アクセスしない方が良いため、今回メソッド経由で取得する
//         board.appendChild(panel.getEL()); //getElementという意味でgetEl()というメソッドを上の方のpanelクラスに作る。注２ カプセル化と呼ぶ
//       });
//     }
// //パネルからpressedクラスを外して、数値を配置する。それぞれのパネルに対して処理するのでforEachで回す。それぞれのパネルはpanelで取得できるのでpanelの方にもactivateするという意味で、同名のメソッドを作ってあげることにしてとりあえずここで呼び出す。配置する数値も渡してあげる。
//     activate() {
//       const nums = [];//あらかじめ数値を配列で用意する。今回numsという定数で[0, 1, 2, 3]と用意する。その上で配置したい数値をランダムに選んであげる。方法はnumsからsplice()を使ってランダムな位置から要素を一つ取り出す。
//       for (let i = 0; i < this.game.getLevel() ** 2; i++) {
//         nums.push(i);
//       }
//       this.panels.forEach(panel => {
//         const num = nums.splice(Math.floor(Math.random() * nums.length), 1)[0];// 注splice()の返り値は一つでも配列になるので、[0]をつけて中身を取り出してあげる必要がある
//         panel.activate(num);//あとはnumをpanel.activate()に渡してあげる
//       });
//     }
//   }

//   class Game {
//     constructor(level) {
//       this.level = level;
//       this.board = new Board(this);

//       this.currentNum = undefined;
//       this.startTime = undefined;
//       this.timeoutId = undefined;//タイマーを止める処理
//       //ボタンをクリックしたらゲームが始まるようにする。まずbtn要素を取得してイベントを設定する
//       const btn = document.getElementById('btn');
//       btn.addEventListener('click', () => {
//         this.start();
//       });
//       this.setup();
//     }

//     setup() {
//       const container = document.getElementById('container');
//       const PANEL_WIDTH = 50;
//       const BOARD_PADDING = 10;
//       /*   50px * 2 + 10px * 2   */
//       container.style.width = PANEL_WIDTH * this.level + BOARD_PADDING * 2 + 'px';
//     }

//     start() {
//       if (typeof this.timeoutId !== 'undefined') {//タイマーが一度しか走らないようにする
//         clearTimeout(this.timeoutId);
//       }

//       this.currentNum = 0;
//       this.board.activate();

//       this.startTime = Date.now();
//       this.runTimer();
//     }
// //タイマー処理方法は、まずタイマーの要素を取得。その上で中身を更新する。現在の時刻からSTARTボタンを押した時の時刻を引いてあげる。ミリ単位なので1000で割ってあげて小数点以下2桁まで表示するためにtoFixed()を使う。
//     runTimer() {
//       const timer = document.getElementById('timer');
//       timer.textContent = ((Date.now() - this.startTime) / 1000).toFixed(2);

// //setTimeout()でこのrunTimer()自身を呼び出してあげればいいので10ミリ秒後に呼び出すと書いてやる。
//       this.timeoutId = setTimeout(() => { 
//         this.runTimer();
//       }, 10);
//     }

//     addCurrentNum() {
//       this.currentNum++;
//     }

//     getCurrentNum() {
//       return this.currentNum;
//     }

//     getTimeoutId() {
//       return this.timeoutId;
//     }

//     getLevel() {
//       return this.level;
//     }
//   }
  
//   new Game(5);
// }  