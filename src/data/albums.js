export const albumImage = (id) => `./img/album/${id}.jpg`
export const photo = (id, by, day, month = 12) => ({
  id,
  src: albumImage(id),
  by,
  day,
  month,
})
export const albums = {
  'bowling-monday': [
    photo('1570472456794-8578e4bf1fab', 'g2', 7),
    photo('1463411563105-157075b06f96', 'g1', 7),
    photo('1538511059256-46e76f13f071', 'mo', 30, 11),
    photo('1608751613440-8880d1a0a1a0', 'g7', 30, 11),
  ],
  'football-beer': [
    photo('1671368913134-c211bc02487f', 'diego', 6),
    photo('1760973501331-c3dc3ab81497', 'g3', 6),
    photo('1529629468183-b9cddd7be13b', 'g7', 29, 11),
    photo('1638707607734-1c6080f904d4', 'mo', 22, 11),
  ],
  'pool-tournament': [
    photo('1544281153-6603be88b354', 'sam', 25, 11),
    photo('1545062080-a71640ea75a1', 'g2', 25, 11),
    photo('1544070928-135893793bdc', 'g6', 18, 11),
    photo('1599685315659-bc876da49fe5', 'sam', 18, 11),
  ],
  'running-club': [
    photo('1552674605-db6ffd4facb5', 'thijs', 15, 11),
    photo('1590333748338-d629e4564ad9', 'g9', 15, 11),
    photo('1758683658297-d7c2512dcb0a', 'g6', 8, 11),
    photo('1571008887538-b36bb32f4571', 'thijs', 8, 11),
  ],
  'warm-hats': [
    photo('1519412849983-957822373d02', 'g4', 26, 10),
    photo('1632649027900-389e810204e6', 'g5', 26, 10),
    photo('1550376026-7375b92bb318', 'anna', 26, 10),
    photo('1557303696-f0a415dc1b3e', 'g8', 19, 10),
  ],
}
export function compressImage(file, maxSize = 1e3, quality = 0.72) {
  return new Promise((d, e) => {
    const f = new FileReader()
    f.onerror = () => e(f.error)
    f.onload = () => {
      const g = new Image()
      g.onerror = e
      g.onload = () => {
        const h = Math.min(1, maxSize / Math.max(g.width, g.height))
        const i = document.createElement('canvas')
        i.width = Math.round(g.width * h)
        i.height = Math.round(g.height * h)
        i.getContext('2d').drawImage(g, 0, 0, i.width, i.height)
        d(i.toDataURL('image/jpeg', quality))
      }
      g.src = String(f.result)
    }
    f.readAsDataURL(file)
  })
}
