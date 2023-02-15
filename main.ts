function get16BE_LUX (reg: number) {
    pins.i2cWriteNumber(
    APDS9960_I2C_ADDR,
    reg,
    NumberFormat.UInt8BE,
    false
    )
    basic.pause(10)
    return pins.i2cReadNumber(APDS9960_I2C_ADDR, NumberFormat.UInt16LE, false)
}

function trunc_lux(x: number, posiciones: number): number {
    let s = x.toString()
    let l = s.length
    let decimalLength = s.indexOf('.') + 1
    let numStr = s.substr(0, decimalLength + posiciones)
    return parseFloat(numStr)
}

function getUInt16BE_LUX (reg: number) {
    pins.i2cWriteNumber(
    APDS9960_I2C_ADDR,
    reg,
    NumberFormat.UInt8BE,
    false
    )
    basic.pause(10)
    return pins.i2cReadNumber(APDS9960_I2C_ADDR, NumberFormat.UInt16BE, false)
}
function setreg_lux (reg: number, dat: number) {
    buf[0] = reg
    buf[1] = dat
    pins.i2cWriteBuffer(APDS9960_I2C_ADDR, buf);
basic.pause(10)
}
function Control () {
    let u = getreg_LUX(APDS9960_CONTROL)
    u |= 0b00001010
setreg_lux(APDS9960_CONTROL, u)
    basic.pause(10)
}
function init () {
    setreg_lux(APDS9960_ENABLE, 0)
    basic.pause(10)
    setreg_lux(APDS9960_ATIME, 255)
    basic.pause(10)
    setreg_lux(APDS9960_WTIME, 255)
    basic.pause(10)
    setreg_lux(APDS9960_CONFIG1, 96)
    basic.pause(10)
    setreg_lux(APDS9960_PERS, 17)
    basic.pause(10)
    setreg_lux(APDS9960_AIHTH, 0)
    basic.pause(10)
    setreg_lux(APDS9960_AIHTL, 65535)
    basic.pause(10)
    setreg_lux(APDS9960_AILTIL, 65535)
    basic.pause(10)
    setreg_lux(APDS9960_AILTH, 0)
    basic.pause(10)
    Control()
    PowerOn()
}
function getreg_LUX (reg: number) {
    pins.i2cWriteNumber(
    APDS9960_I2C_ADDR,
    reg,
    NumberFormat.UInt8BE,
    false
    )
    basic.pause(10)
    return pins.i2cReadNumber(APDS9960_I2C_ADDR, NumberFormat.UInt8BE, false)
}
function PowerOn () {
    let t = getreg_LUX(APDS9960_ENABLE)
    t |= 0b00011011
    setreg_lux(APDS9960_ENABLE, t)
    basic.pause(10)
}

const APDS9960_I2C_ADDR = 57
const APDS9960_ENABLE = 128
const APDS9960_ATIME = 129
const APDS9960_WTIME = 131
const APDS9960_AILTIL = 132
const APDS9960_AILTH = 133
const APDS9960_AIHTL = 134
const APDS9960_AIHTH = 135

const APDS9960_PERS = 140
const APDS9960_CONFIG1 = 141
const APDS9960_PPULSE = 142
const APDS9960_CONTROL = 143
const APDS9960_CONFIG2 = 144
const APDS9960_ID = 146
const APDS9960_STATUS = 147
const APDS9960_CDATAL = 148
const APDS9960_CDATAH = 149
const APDS9960_RDATAL = 150
const APDS9960_RDATAH = 151
const APDS9960_GDATAL = 152
const APDS9960_GDATAH = 153
const APDS9960_BDATAL = 154
const APDS9960_BDATAH = 155
let buf = pins.createBuffer(2);

//% color=#4c6ef5 weight=25 icon="\uf043" block="APDS9960"
namespace CIP_APDS9960 {
init();
let illuminance = 0

    /**
         * Returns a number describing the lux 
        */
    //% blockId="APDS9960_read_LUX"
    //% block="leer lux"
    export function leer_lux(): number {
        let b = getUInt16BE_LUX(APDS9960_STATUS)
        let TL = getUInt16BE_LUX(APDS9960_AILTIL);
        let TH = getUInt16BE_LUX(APDS9960_AIHTH);
        let LH = getUInt16BE_LUX(APDS9960_AILTH);
        let HL = getUInt16BE_LUX(APDS9960_AIHTL);
  
        let c = getUInt16BE_LUX(APDS9960_CDATAL);
        basic.pause(10)
        if ((c >= TH + LH) || (c <= TL + HL)) {
            let r = getUInt16BE_LUX(APDS9960_RDATAL);
            let g = getUInt16BE_LUX(APDS9960_GDATAL);
            let d = getUInt16BE_LUX(APDS9960_BDATAL);
            illuminance = (-0.32466 * r) + (1.57837 * g) + (-0.73191 * b);
            if (illuminance < 0) illuminance = Math.abs(illuminance) 
        }
        //basic.showNumber(illuminance)
        return trunc_lux(illuminance, 2)
    }
}
