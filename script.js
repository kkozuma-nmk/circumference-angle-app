const canvas = document.getElementById('circumferenceCanvas');
const ctx = canvas.getContext('2d');
const center = { x: 200, y: 200 };
const radius = 150;

let points = {
    P: { x: 200, y: 50, dragging: false },
    A: { x: 200-75*Math.sqrt(3), y: 275, dragging: false },
    B: { x: 200+75*Math.sqrt(3), y: 275, dragging: false },
};

function drawCircle() {
    ctx.beginPath();
    ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawPoint(point, label) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillText(label, point.x + 10, point.y);
}

function drawLine(start, end) {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
}

function calculateAngle(a, b, c) {
    const ab = Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
    const bc = Math.sqrt(Math.pow(c.x - b.x, 2) + Math.pow(c.y - b.y, 2));
    const ac = Math.sqrt(Math.pow(c.x - a.x, 2) + Math.pow(c.y - a.y, 2));
    return Math.acos((ab * ab + bc * bc - ac * ac) / (2 * ab * bc)) * (180 / Math.PI);
}

function prime(O,A,ratio){

    return{
        x: (ratio * O.x + A.x) / (ratio + 1),
        y: (ratio * O.y + A.y) / (ratio + 1)
    };
}


function drawArcSector(center, A, B, ratio) {
    // 点A', B'の計算
    const A_prime = prime(center,A,ratio);
    const B_prime = prime(center,B,ratio);

    // 中心角を計算
    const angleOA = Math.atan2(A_prime.y - center.y, A_prime.x - center.x);
    const angleOB = Math.atan2(B_prime.y - center.y, B_prime.x - center.x);

    // おうぎ形を描画
    ctx.beginPath();
    ctx.moveTo(center.x, center.y); // O点からスタート
    ctx.lineTo(A_prime.x, A_prime.y); // A'に線を引く
    ctx.arc(center.x, center.y, radius * ratio / (ratio + 1), angleOA, angleOB); // 弧を描く
    ctx.lineTo(center.x, center.y); // O点に戻る
    ctx.closePath();
    ctx.fillStyle = 'blue'; // 塗りつぶしの色
    ctx.fill();
}




function findCPrime(O, A, B, ratio) {
    // ベクトルOAとOBを求める
    const OA = {x: A.x - O.x, y: A.y - O.y};
    const OB = {x: B.x - O.x, y: B.y - O.y};

    // OAとOBの角度を計算
    const angleA = Math.atan2(OA.y, OA.x);
    const angleB = Math.atan2(OB.y, OB.x);

    // 弧ABの中間の角度を計算
    let midAngle = (angleA + angleB) / 2;

    //弧が大きい場合、角度を逆方向にする
    if (Math.abs(angleA - angleB) > Math.PI) {
        midAngle += Math.PI;
        midAngle = midAngle % (2 * Math.PI);
    };

    // 中間の角度から弧ABの中点Cの座標を計算
    const C = {
        x: O.x + radius * ratio * Math.cos(midAngle),
        y: O.y + radius * ratio * Math.sin(midAngle)
    };

    // 角度を表示する点C'の座標を計算
    const C_prime = {
        x: 1.5 * (C.x - O.x)+O.x,
        y: 1.5 * (C.y - O.y)+O.y
    };
    
    return C_prime

}

function findCPrimePrime(O, A, B, ratio) {
    // ベクトルOAとOBを求める
    const OA = {x: A.x - O.x, y: A.y - O.y};
    const OB = {x: B.x - O.x, y: B.y - O.y};

    // OAとOBの角度を計算
    const angleA = Math.atan2(OA.y, OA.x);
    const angleB = Math.atan2(OB.y, OB.x);

    // 弧ABの中間の角度を計算
    let midAngle = (angleA + angleB) / 2;

    //弧が大きい場合、角度を逆方向にする
    if (Math.abs(angleA - angleB) > Math.PI) {
        midAngle += Math.PI;
        midAngle = midAngle % (2 * Math.PI);
    };

    // 中間の角度から弧ABの中点Cの座標を計算
    const C = {
        x: O.x + radius * ratio * Math.cos(midAngle),
        y: O.y + radius * ratio * Math.sin(midAngle)
    };

    // 角度を表示する点C'の座標を計算
    const C_prime = {
        x: -1.5 * (C.x - O.x)+O.x,
        y: -1.5 * (C.y - O.y)+O.y
    };
    
    return C_prime

}

// function findCPrime(O, A, B) {
//     // 弧ABの中点Cを計算
//     const C = calculateMidpointOnArc(O, A, B);

//     // ODの中点がCとなるためのDの座標を計算
//     const D = {
//         x: 2 * C.x - O.x,
//         y: 2 * C.y - O.y
//     };

//     return D;
// }

console.log(findCPrime(center,points.A,points.B,0.2));

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCircle();
    drawPoint(center, 'O');
    for (const [label, point] of Object.entries(points)) {
        drawPoint(point, label);
    }
    drawLine(center, points.A);
    drawLine(center, points.B);
    drawLine(points.A, points.P);
    drawLine(points.B, points.P);

    const angleAPB = calculateAngle(points.A, points.P, points.B);
    const angleAOB = calculateAngle(points.A, center, points.B);

    const vectorPA = { x: points.A.x - points.P.x, y: points.A.y - points.P.y };
    const vectorPB = { x: points.B.x - points.P.x, y: points.B.y - points.P.y };
    const crossProduct = vectorPA.x * vectorPB.y - vectorPA.y * vectorPB.x;
    const vectorOA = { x: points.A.x - center.x, y: points.A.y - center.y };
    const vectorOB = { x: points.B.x - center.x, y: points.B.y - center.y };
    const crossProduct2 = vectorOA.x * vectorOB.y - vectorOA.y * vectorOB.x;

    const convexQuadrilateral = crossProduct * crossProduct2 < 0;

    const displayedAngleAOB = convexQuadrilateral ? 360 - angleAOB : angleAOB;

    console.log(displayedAngleAOB);

    const roundedAngleAPB = Math.round(angleAPB * 2) / 2;
    const displayedAPB = roundedAngleAPB % 1 === 0 ? roundedAngleAPB.toFixed(0) : roundedAngleAPB.toFixed(1);

    const O_prime = convexQuadrilateral ? findCPrimePrime(center, points.A, points.B,0.2) : findCPrime(center, points.A, points.B,0.2);;
    const P_prime = findCPrime(points.P, points.A, points.B,0.2);

    if (crossProduct < 0) {
        drawArcSector(center, points.B, points.A, 0.2);
        drawArcSector(points.P, points.B, points.A, 0.2); // 時計回り
        
    } else {
        drawArcSector(center, points.A, points.B, 0.2);
        drawArcSector(points.P, points.A, points.B, 0.2); // 反時計回り
    }

    // おうぎ形を描画
    //drawArcSector(center, points.A, points.B, 0.2);//中心角を上側に表示
    //drawArcSector(points.P, points.A, points.B, 0.2);//円周角を上側に表示
    //drawArcSector(center, points.B, points.A, 0.2);//中心角を下側に表示
    //drawArcSector(points.P, points.B, points.A, 0.2);//円周角を下側に表示

    // ∠APBの表示位置を円の内側に調整
    
    ctx.font = '20px Arial';
    ctx.textAlign = "center";
    ctx.fillText(`${displayedAPB}°`, P_prime.x, P_prime.y);

    // // ∠AOBの表示位置を円の内側に調整
    ctx.font = '20px Arial';
    ctx.textAlign = "center";
    ctx.fillText(`${displayedAngleAOB.toFixed(0)}°`, O_prime.x, O_prime.y);

}



function isPointInCircle(x, y) {
    return Math.sqrt(Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2)) <= radius;
}

function snapToCircle(x, y) {
    const angle = Math.atan2(y - center.y, x - center.x);
    return {
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle)
    };
}


// mousedown と touchstart の両方に対応
canvas.addEventListener('mousedown', handleStart);
canvas.addEventListener('touchstart', handleStart);

function handleStart(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = (event.clientX || event.touches[0].clientX) - rect.left;
    const mouseY = (event.clientY || event.touches[0].clientY) - rect.top;

    for (const point of Object.values(points)) {
        if (Math.sqrt(Math.pow(mouseX - point.x, 2) + Math.pow(mouseY - point.y, 2)) < 10) {
            point.dragging = true;
            break;
        }
    }
}

// mousemove と touchmove の両方に対応
canvas.addEventListener('mousemove', handleMove);
canvas.addEventListener('touchmove', handleMove);

function handleMove(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = (event.clientX || event.touches[0].clientX) - rect.left;
    const mouseY = (event.clientY || event.touches[0].clientY) - rect.top;

    for (const point of Object.values(points)) {
        if (point.dragging && isPointInCircle(mouseX, mouseY)) {
            const snappedPoint = snapToCircle(mouseX, mouseY);
            point.x = snappedPoint.x;
            point.y = snappedPoint.y;
            draw();
            break;
        }
    }
    event.preventDefault(); // スクロールやズームの無効化
}

// mouseup と touchend の両方に対応
canvas.addEventListener('mouseup', handleEnd);
canvas.addEventListener('touchend', handleEnd);

function handleEnd() {
    for (const point of Object.values(points)) {
        point.dragging = false;
    }
}





// canvas.addEventListener('mousedown', function(event) {
//     const rect = canvas.getBoundingClientRect();
//     const mouseX = event.clientX - rect.left;
//     const mouseY = event.clientY - rect.top;

//     for (const point of Object.values(points)) {
//         if (Math.sqrt(Math.pow(mouseX - point.x, 2) + Math.pow(mouseY - point.y, 2)) < 10) {
//             point.dragging = true;
//             break;
//         }
//     }
// });

// canvas.addEventListener('mousemove', function(event) {
//     const rect = canvas.getBoundingClientRect();
//     const mouseX = event.clientX - rect.left;
//     const mouseY = event.clientY - rect.top;

//     for (const point of Object.values(points)) {
//         if (point.dragging && isPointInCircle(mouseX, mouseY)) {
//             const snappedPoint = snapToCircle(mouseX, mouseY);
//             point.x = snappedPoint.x;
//             point.y = snappedPoint.y;
//             draw();
//             break;
//         }
//     }
// });

// canvas.addEventListener('mouseup', function() {
//     for (const point of Object.values(points)) {

//         point.dragging = false;
//     }
// });

draw();

// window.showNextDiagram = function() {
//     // 次の図を表示するロジックをここに追加します
//     drawPoint(point, label);
// };
