const fetch = require('node-fetch');

const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});
 
readline.question('Lütfen arayacağınız sözcüğü giriniz:\n', async (name) => {
  let search = encodeURIComponent(name);
  let val = await fetch(`https://sozluk.gov.tr/gts?ara=${search}`)
  let value = await val.json();

  if (value.error) { console.log(`\n${name} ile alakalı bir sonuç bulamadım.\n`); return readline.close(); }

  let data = [];
  value[0].anlamlarListe.forEach((arr) => {
    if (arr.anlam && arr.orneklerListe) data.push(`${arr.anlam}\n - ${arr.orneklerListe[0].ornek}`);
    if (arr.anlam && !arr.orneklerListe) data.push(`${arr.anlam}\n - Örnek bulamadım. :(`)
  });

  let proverbs = [];
  if (value[0].atasozu) {
    value[0].atasozu.forEach((arr) => {
      if (arr.madde) proverbs.push(` - ${arr.madde}`);
    });
  };

  if (value[0].anlamlarListe[0] && data[0] && !proverbs[0]) console.log(`\n${name}:\n\n${data.join("\n")}\n`);
  if (value[0].anlamlarListe[0] && data[0] && proverbs[0]) console.log(`\n${name}:\n\n${data.join("\n")}\n\n${name} ile ilgili atasözleri:\n${proverbs.join("\n")}\n`);

  readline.close();
});