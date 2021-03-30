namespace SpriteKind {
    export const turret = SpriteKind.create()
    export const coin = SpriteKind.create()
    export const magnet = SpriteKind.create()
    export const cars = SpriteKind.create()
    export const icon = SpriteKind.create()
    export const repair = SpriteKind.create()
}

let where_coin = 0;
let where_car = 0;
let where_repair = 0;
let where_magnet= 0;
let y_position = [22, 47, 72, 97]
let car = [
    assets.image`redCar`,
    assets.image`greenCar`,
    assets.image`blueCar`,
    assets.image`thanosCar`,
    assets.image`truck`
    ]

let magnetised = false
let poweredUp = false
let hasCannon = true
let power_up = 0

music.setVolume(10)
scene.setBackgroundImage(assets.image`road`)

let tank = sprites.create(assets.image`tank`, SpriteKind.Player)
tank.setPosition(35, 47)
controller.moveSprite(tank, 40, 0)
tank.setStayInScreen(true)

//ikona magnetu a náboja
let magnetIcon = sprites.create(assets.image`magnetIcon`, SpriteKind.icon)     
magnetIcon.setPosition(105, 115)
magnetIcon.setFlag(SpriteFlag.Invisible, true)
let ammoIcon = sprites.create(assets.image`ammoIcon`, SpriteKind.icon)
ammoIcon.setPosition(90, 115)
ammoIcon.setFlag(SpriteFlag.Invisible, true)

//bar zobrazujúci nabitie
let power_indicator_img = [
    assets.image`power0`,
    assets.image`power1`,
    assets.image`power2`,
    assets.image`power3`,
    assets.image`power4`,
    assets.image`power5`
    ]
let power_indicator = sprites.create(power_indicator_img[0], SpriteKind.icon)
power_indicator.setPosition(45, 116)

//array obrázkov cesty
let road = [
    assets.image`road_1`,
    assets.image`road_2`,
    assets.image`road_3`,
    assets.image`road_4`,
    assets.image`road_5`,
    assets.image`road_6`,
    assets.image`road_7`,
    assets.image`road_8`,
    assets.image`road_9`,
    assets.image`road_10`,
    assets.image`road_11`,
    assets.image`road_12`,
    assets.image`road_13`,
    assets.image`road_14`,
    assets.image`road_15`,
    assets.image`road_16`,
    assets.image`road_17`,
    assets.image`road_18`,
    assets.image`road_19`,
    assets.image`road_20`,
    assets.image`road_21`,
    assets.image`road_22`,
    assets.image`road_23`,
    assets.image`road_24`,
    assets.image`road_25`,
    assets.image`road_26`,
    assets.image`road_27`,
    assets.image`road_28`,
    assets.image`road_29`,
    assets.image`road_30`,
    assets.image`road_31`,
    assets.image`road_32`,
    assets.image`road_33`,
    assets.image`road_34`,
    assets.image`road_35`
    ]

//ovládanie
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {      
    if (tank.y > 22) {
        tank.y += -25
    }
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (tank.y < 97) {
        tank.y += 25
    }
})
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (poweredUp && hasCannon) {
        let strela = sprites.create(assets.image`bullet`, SpriteKind.Projectile)
        strela.setPosition(tank.x+30, tank.y)
        strela.setVelocity(100, 0)
    }
})

//"hýbajúce sa" pozadie
forever(function () {                    
    for (let value of road) {
        scene.setBackgroundImage(value)
        pause(33)
    }
})

//skóre
game.onUpdateInterval(100, function () { 
    info.changeScoreBy(1)
})

//generovanie mincí
game.onUpdateInterval(4000, function () {  
    if (poweredUp == false) {
        where_coin = randint(0, 3)
        while (where_coin == where_car) {
            where_coin = randint(0, 3)
        }
        let coin = sprites.create(assets.image`coin`, SpriteKind.coin)
        coin.setVelocity(-60 - info.score() / 4, 0)
        coin.setPosition(175, y_position[where_coin])
        if (magnetised) {
            coin.follow(tank, 60 + info.score() / 4)
        }
    }
})

//Zbieranie mincí
sprites.onOverlap(SpriteKind.Player, SpriteKind.coin, function (sprite, otherSprite) {
    otherSprite.destroy()
    music.baDing.play()
    power_up += 1
    power_indicator.setImage(power_indicator_img[power_up])
    if (power_up >= 5) {
        poweredUp = true
        ammoIcon.setFlag(SpriteFlag.Invisible, false)
        for (let index = 0; index <= 4; index++) {
            pause(1000)
            power_up += -1
            power_indicator.setImage(power_indicator_img[power_up])
        }
        ammoIcon.setFlag(SpriteFlag.Invisible, true)
        poweredUp = false
    }
})

// generovanie magnetu
game.onUpdateInterval(20000, function () {
    where_magnet = randint(0, 3)
    while (where_magnet == where_car) {
        where_magnet = randint(0, 3)
    }
    let magnet = sprites.create(assets.image`magnet`, SpriteKind.magnet)
    magnet.setVelocity(-60 - info.score() / 4, 0)
    magnet.setPosition(175, y_position[where_magnet])
})

//Zbieranie magnetov
sprites.onOverlap(SpriteKind.Player, SpriteKind.magnet, function (sprite, otherSprite) {
    music.baDing.play()
    magnetised = true
    otherSprite.destroy()
    magnetIcon.setFlag(SpriteFlag.Invisible, false)
    pause(10000)
    magnetIcon.setFlag(SpriteFlag.Invisible, true)
    magnetised = false
})

//generovanie aut
forever(function () { 
    where_car = randint(0, 3)
    while (where_car == where_coin) {
        where_car = randint(0, 3)
    }
    let obstacle = sprites.create(car[randint(0, 4)], SpriteKind.cars)
    obstacle.setVelocity(-60 - info.score() / 4, 0)
    obstacle.setPosition(175, y_position[where_car])
    pause(2000 / (1 + info.score() / 480))
})

//Strieľanie do aut
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.cars, function (sprite, otherSprite) {
    sprite.destroy()
    otherSprite.destroy(effects.fire, 200)
    music.smallCrash.play()
})

//Narazenie do auta
sprites.onOverlap(SpriteKind.Player, SpriteKind.cars, function (sprite, otherSprite) {
    if (hasCannon) {
        tank.setImage(assets.image`damagedTank`)
        hasCannon = false
        otherSprite.destroy(effects.fire, 200)
        music.smallCrash.play()
    } else {
        game.over(false)
    }
})

//generovanie kľuča
forever(function () {
    pause(randint(4000, 30000))
    if (hasCannon == false) {
        where_repair = randint(0, 3)
        while (where_repair == where_car) {
            where_repair = randint(0, 3)
        }
        let repair = sprites.create(assets.image`repair`, SpriteKind.repair)
        repair.setVelocity(-60 - info.score() / 4, 0)
        repair.setPosition(175, y_position[where_repair])
    }
})

//opravovanie dela
sprites.onOverlap(SpriteKind.Player, SpriteKind.repair, function (sprite, otherSprite) {
    music.jumpUp.play()
    hasCannon = true
    otherSprite.destroy()
    tank.setImage(assets.image`tank`)
})

