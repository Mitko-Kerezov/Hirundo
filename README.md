# Hirundo
### Описание
Един български стартъп решил да направи местен клонинг на Twitter, наречен Hirundo.
Поради ограничените ресурси, клонингът ще е максимално опростен откъм
функционалност. За да може разработката да започне веднага и системата да поеме
бъдещото си развитие, разработчиците решили да използват **MongoDB**.
### Съхранявана информация
##### Съобщение
Всяко съобщение трябва да съдържа следната информация:
* автор (еднозначна връзка към потребител)
* съдържание (ограничено до 140 знака)
* място на публикуването (незадължителен свободен текст)
* дата на публикуване
##### Потребител
За всеки потребител ще се пази следната информация:
* потребителско име (уникално за потребителя, ще бъде показвано заедно с
неговите съобщения)
* email
* парола (в хеширан вид)
* дата на регистрация
* списък на потребителите, които той следва (еднозначни връзки)
* verified някои
потребители могат да имат флаг, указващ че са „проверени“,
подобно на verified accounts в Twitter
##### Функционалност
Да се предоставят следните функции:
###### Вход / регистрация
Системата да може да се ползва само от регистрирани потребители. За целта да се
изготви функционалност за регистрация на потребител (чрез email
и парола, без
потвърждения и пр.) и вход в системата.
###### Timeline
Да се предостави възможност потребителят да види последните 50 съобщения от хората,
които следва.
###### Въвеждане на съобщение
Потребителят да може да въвежда съобщение в пригодена форма. Да се спазва
ограничението за дължина на съобщенията. Необходимо е да има и допълнително поле,
в което може да се въведе мястото, от което съобщението е публикувано.
###### Следване / прекратяване на следването на други потребители
Да се предостави интерфейс, чрез който потребителят може да избере кой да следва
(например от списък с всички потребители). Следваните потребители да се означават по
различен начин, като има възможност да се прекрати следването им.
###### Статистики
Да се предоставят следните статистики като част от приложението:
* първите 10 потребители с найголям
брой написани съобщения, които съдържат
дадена ключова дума (да се показва броят на съобщенията)
* какъв процент от съобщенията на потребителя са изпратени в дадени часови
интервали (примерни интервали са 24:004:
00, 4:008:
00, 8:0016:
00, 16:0024:
00;
можете да използвате каквито пожелаете)
* какъв процент от съобщенията на потребителя са изпратени в даден списък от
предварително избрани локации (например “Sofia”, “Plovdiv”, “Varna”, “Other”;
можете да използвате каквито пожелаете)
###### Филтриране по хештаг ( незадължителен бонус )
Хештаговете (низ, започващ с “#”) да се отбелязват по различен начин. При цъкане на тях
да се прилага филтър и в timelineа
да се показват само съобщенията, които съдържат
дадения хеш таг. При избиране на още хештагове, да се филтрира сечението на
съобщенията, съдържащи селектираните. Да се добави бутон за изчистване на
селектираните хештагове.
