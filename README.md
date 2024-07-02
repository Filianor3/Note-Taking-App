1. დავდგეთ ფრონტის დირექტორიაში და გავუშვათ npm install
2. დავდგეთ ბექის დირექტორიაში და გავუშვათ npm install
   ამის შემდეგ ყველა გამოყენებული package, library ... etc დაინსტალირდება რომელიც აპლიკაციის გასაშვებადაა საჭირო
3. დავდგეთ backend-ში და გავუშვათ ბრძანება npm start იმისთვის რომ მოისტარტოს სერვერი
4. დავდგეთ frontend-ში და გავუშვათ ბრძანება npm run dev იმისთვის რომ გაეშვას ლოკალზე აპლიკაციის front
   ამის შემდეგ ვესტუმროთ ტერმინალში მოცემულ ლინკს და გამოვიყენოთ აპლიკაცია

DISCLAIMER: საიტზე შესასვლელად localhost:XXXX/login ან /SignUp ან /notes

DISCLAIMERv2(? very not sure about this one) backend -> .env ფაილში შესაძლოა გახდეს გასაწერი (იმედია ვცდები) SECRET_ACCESS_TOKEN
ამ ცვლადის დაგენერირებისთვის გავხსნათ cmd/terminal და გავუშვათ ბრძანება:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
