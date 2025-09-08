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

    let player;
    let stars;
    let platforms;
    let cursors;


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
        this.add.image는 단일 이미지를 게임 씬에 추가하는 함수.
        첫 번째와 두 번째 인자는 이미지의 x, y 좌표를 나타내며, 
        세 번째 인자는 로드된 이미지의 key를 지정함.
        */
        this.add.image(400, 300, 'sky'); // 하늘 배경 추가

        /*
        this.physics는 물리 엔진(Arcade Physics)을 관리하는 객체로, 
        물리 기반의 게임 오브젝트를 생성하고 제어하는 데 사용됨.
        physics 객체는 보통 config 객체 내에서 다룸.
        */
        platforms = this.physics.add.staticGroup(); 
        platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');

        player = this.physics.add.sprite(100, 450, 'dude');

        player.setBounce(0.2); // 바운스 설정
        player.setCollideWorldBounds(true); // 월드 경계에 충돌 설정

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
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
        
        this.physics.add.collider(player, platforms); // 플레이어와 플랫폼 간의 충돌 처리
        
        cursors = this.input.keyboard.createCursorKeys();
        
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