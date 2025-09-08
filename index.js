let player;
let stars;
let platforms;
let cursors;
let score = 0;
let scoreText;
let bombs;
let gameOver = false;

var config = {
        type: Phaser.AUTO,      // 렌더러 타입(AUTO: WebGL 또는 Canvas 자동 선택)
        width: 800,             // 게임 화면의 너비(px)
        height: 600,            // 게임 화면의 높이(px)
        scene: {                // 게임의 씬(장면) 설정
            preload: preload,   // 에셋(이미지, 사운드 등) 로드 함수
            create: create,     // 게임 객체 생성 및 초기화 함수
            update: update      // 매 프레임마다 호출되는 게임 로직 함수
        },
        physics: {              // 물리 엔진 설정
            default: 'arcade',  // 기본 물리 엔진 설정(Arcade Physics)
            arcade: {
                gravity: { y: 300 }, // 중력 설정(y축 방향)
                debug: false         // 디버그 모드 비활성화
            }
        }
    };

// Phaser 게임 인스턴스를 생성합니다.
var game = new Phaser.Game(config);

// 게임 시작 전에 필요한 에셋(이미지, 오디오 등)을 로드하는 함수
// preload()가 끝나야 create()가 실행됨 -> 리소스가 다 로딩되기 전에는 게임이 시작되지 않음.
function preload () {
    
    /* 
    this.load.image는 단일 이미지 파일을 불러올 때 사용하는 함수로 보통 고정된 오브젝트에 사용.
    불러온 이미지는 this.add.image나 this.add.sprite 같은 함수에서 key로 참조할 수 있음.
    */
    this.load.image('sky', 'assets/sky.png'); // 하늘
    this.load.image('ground', 'assets/platform.png'); // 땅
    this.load.image('star', 'assets/star.png'); // 별
    this.load.image('bomb', 'assets/bomb.png'); // 폭탄
    
    /*
    this.load.spritesheet는 스프라이트 시트(여러 프레임이 하나의 이미지에 포함된 형태)를 불러올 때 사용하는 함수.
    주로 애니메이션이 필요한 캐릭터나 오브젝트에 사용.
    불러온 스프라이트 시트는 this.add.sprite 같은 함수에서 key로 참조할 수 있음.
    3번째 인자는 프레임의 너비와 높이를 지정하는 객체로, 
    Phaser가 스프라이트 시트에서 개별 프레임을 추출하는 데 사용됨.
    */

    this.load.spritesheet('dude', 'assets/dude.png', {frameWidth: 32, frameHeight: 48}); // 주인공 캐릭터
}

// 게임 객체를 생성하고 초기화하는 함수(필요시 구현)
// 게임 객체들은 호출된 순서대로 나타나므로, 호출 순서가 매우 중요함.
function create () {
    /*
    this.add.image()는 단일 이미지를 게임 씬에 추가하는 함수.
    첫 번째와 두 번째 인자는 이미지의 x, y 좌표를 나타내며, 
    세 번째 인자는 로드된 이미지의 key를 지정함.
    */
    this.add.image(400, 300, 'sky'); // 하늘 배경 추가

    /*
    this.physics는 물리 엔진(Arcade Physics)을 관리하는 객체로, 
    물리 기반의 게임 오브젝트를 생성하고 제어하는 데 사용됨.
    physics 객체는 보통 config 객체 내에서 다룸.
    */
    
    /*
    this.physics.add.staticGroup()은 정적 물리 그룹을 생성하는 함수.
    정적 물리 그룹에 속한 오브젝트들은 물리 엔진의 충돌 감지는 적용되지만,
    중력이나 속도 등 물리적 움직임의 영향을 받지 않고 항상 고정된 위치에 있음.
    */
    platforms = this.physics.add.staticGroup(); 
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100, 450, 'dude');

    player.setBounce(0.2); // 바운스 설정
    player.setCollideWorldBounds(true); // 월드 경계에 충돌 설정

    this.anims.create({ // 애니메이션 설정
        key: 'left', // left라는 key에 대한 애니메이션 설정
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }), 
        // 스프라이트의 0~3까지를 left 애니메이션의 프레임으로 사용
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    
    this.physics.add.collider(player, platforms); // 플레이어와 플랫폼 간의 충돌 처리 추가
    
    cursors = this.input.keyboard.createCursorKeys(); // 방향키 입력 설정
    
    stars= this.physics.add.group({ // 별 그룹에 속한 모든 오브젝트가 phaser의 물리 엔진의 영향을 받도록 설정
        key: 'star',
        repeat: 11, // 기본적으로 1개의 오브젝트를 생성하기 때문에 총 12개 생성
        setXY: { x: 12, y: 0, stepX: 70 } // 그룹이 생성하는 12개의 오브젝트 위치를 한꺼번에 설정
        // x: 12, y: 0에서 시작하여 각 오브젝트마다 x 좌표를 70씩 증가시키며 배치
    });

    stars.children.iterate(function (child) { //child 오브젝트들에게 각각 반복하도록 지시
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8)); // 각 별의 바운스 값을 무작위로 설정
    })

    this.physics.add.collider(stars, platforms); // 별과 플랫폼 간의 충돌 처리 추가
    this.physics.add.overlap(player, stars, collectStar, null, this); 
    // 플레이어와 별이 겹칠 때 실행될 메소드(콜백 함수) 호출하는 함수
    // (감지할 첫 번째 대상, 감지할 두 번째 대상, 겹쳤을 때 호출될 콜백 함수, 
    // 콜백을 실행할지 말지 결정하는 필터 함수, 콜백 내부에서 this가 뭘 가리킬 지 지정)

    scoreText = this.add.text(16, 16, 'score: 0', { fontsize: '32px', fill: '#000' });
    //scoreText는 16x16 크기이며, 기본적으로 'score: 0'으로 표시됨, fontsize와 색상도 설정 가능
    
    bombs = this.physics.add.group(); // 폭탄 그룹도 phaser의 물리 엔진의 영향을 받도록 설정
    this.physics.add.collider(bombs, platforms); // 폭탄과 플랫폼 간의 충돌 처리 추가
    this.physics.add.collider(player, bombs, hitBomb, null, this); 
    // 플레이어와 폭탄이 겹칠 때 hitBomb 콜백 함수 호출

    function hitBomb (player, bomb) {
        this.physics.pause(); // 물리 엔진 일시정지
        player.setTint(0xff0000); // 플레이어 색상을 빨간색으로 변경
        player.anims.play('turn'); // 플레이어를 'turn' 애니메이션 상태로 변경
        gameOver = true; // 게임 오버 상태 설정
    }
    
    function collectStar (player, star) { //플레이어와 별이 겹치면
        
        // 별을 비활성화(1번째 true)하고 화면에서 제거(2번째 true)
        star.disableBody(true, true);

        // 점수를 10점 증가시키고, 점수 업데이트
        score += 10; 
        scoreText.setText('Score: ' + score);

        // countActive는 그룹 내 메소드로 비활성화되지 않은 오브젝트의 개수를 반환
        // 화면에 남아있는 별의 개수가 0이면 
        if (stars.countActive(true) === 0) {
            stars.children.iterate(function (child) {
                // 별을 다시 활성화하고 화면 상단에 재배치
                child.enableBody(true, child.x, 0, true, true);
            });

            /* 폭탄을 생성할 x 좌표를 플레이어의 현재 위치를 기준으로 설정
            게임의 전체 너비가 800이므로, 400을 기준으로 400 미만이면 400 ~ 800 사이에서,
            400 이상이면 0 ~ 400 사이에서 무작위로 나타나도록 설정 
            -> 플레이어와 폭탄이 너무 가까이 생성되는 것을 방지
            */
            let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            let bomb = bombs.create(x, 16, 'bomb'); // 폭탄 생성
            bomb.setBounce(1); // 폭탄 바운스 설정
            bomb.setCollideWorldBounds(true); // 폭탄이 월드 경계에 충돌하도록 설정
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20); // 폭탄의 초기 속도 설정
            //x축 속도는 -200 ~ 200 사이에서 무작위로 설정, y축 속도는 20으로 설정
        }
    }
}

// 매 프레임마다 호출되는 게임 로직 함수(필요시 구현)
function update () {
    if (cursors.left.isDown) { // 왼쪽 방향키를 누르면
        player.setVelocityX(-160); // 왼쪽 이동 속도 설정
        player.anims.play('left', true); // 왼쪽 이동 애니메이션 재생
    } else if (cursors.right.isDown) { // 오른쪽
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else { // 방향키를 누르지 않으면 기본적으로 'turn' 형태 재생
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) { // 위 방향키를 누르고 바닥에 닿아있으면
        player.setVelocityY(-330); // 캐릭터의 y축 속도를 음수로 설정하여 위쪽으로 순간적으로 변경
    }
}