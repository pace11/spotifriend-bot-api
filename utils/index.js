const { format, differenceInDays, differenceInMonths } = require('date-fns')

const saySomething = (data) => {
  return `<b>Hallo Gengs!!</b> gimana kabarnya hari ini?? semoga sehat selalu. Ada quotes menarik dari <em><b>${data?.author}</b> - ${data?.content}.</em> So, semangat terus ya untuk hari ini`
}

const sayHello = () => {
  return 'Perkenalkan saya <b>Spotifriend Bot</b>, untuk informasi detailnya bisa melalui perintah: <code>/info</code> https://media.giphy.com/media/Q66ZEIpjEQddUOOKGW/giphy.gif'
}

const sayThanks = () => {
  return 'Sama2 Kak !! https://media.giphy.com/media/3oFzm6XsCKxVRbZDLq/giphy-downsized-large.gif'
}

const sayInfo = (data) => {
  const days = differenceInDays(new Date(data?.expires_at ?? null), new Date())
  const month = differenceInMonths(
    new Date(data?.expires_at ?? null),
    new Date(),
  )
  const diffDate = `${month > 1 ? month + ' bulan lagi' : days + ' hari lagi'}`

  return `Saat ini kalian tergabung di <b>${
    data?.title ?? ''
  }</b> <code>jumlah member:${data?.member_count ?? 0}/6</code>, <code>plan:${
    data?.plan
  } bulan</code> berakhir pada: <b>${format(
    new Date(data?.expires_at ?? null),
    'd MMMM yyyy',
  )} (${diffDate})</b>`
}

const renderText = ({ type, data }) => {
  const template = {
    says: saySomething(data),
    hello: sayHello(),
    info: sayInfo(data),
    thanks: sayThanks(),
  }

  return template[type] ?? template?.hello
}

module.exports = {
  renderText,
}
