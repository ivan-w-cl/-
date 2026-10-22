/* Chinese Home Match, adapted from the supplied design. No network requests or AI calls.
   Place records are imported reference data, not independently verified live business data. */
(() => {
  'use strict';
  const isChinese = () => document.documentElement.lang.toLowerCase().startsWith('zh');
  const local = (en, zh) => isChinese() ? zh : en;
  // Imported verbatim from the supplied reference; duplicates are removed below.
  const POI_RAW = "night|53.40514|-2.95416||The Royal Arms\nnight|53.40380|-2.97680||The Liffey\nnight|53.40094|-2.97638||Blue Angel\nrest|53.40150|-2.97902||3345\nnight|53.39256|-2.94900||Chaplins Bar\nculture|53.40983|-2.98180||World Museum Liverpool\nlib|53.40991|-2.98065||Liverpool Central Library\nnight|53.40792|-2.99109||Barton Rouge\nnight|53.40497|-2.99161||The Liverpool\nnight|53.40741|-2.99394||The Pig and Whistle\nnight|53.40661|-2.99432||Ma Boyles Alehouse \u0026 Eatery\nnight|53.40090|-2.99151||Revolution de Cuba\nrest|53.39907|-2.99254||PanAm\nnight|53.40035|-2.97294||The Pilgrim\nnight|53.42476|-2.95456||The George\nculture|53.39927|-2.99207||The Beatles Story\nrest|53.40052|-2.97757|a|New Star\nrest|53.40054|-2.97839||Il Forno\nrest|53.40047|-2.97872|s|Mayur\nrest|53.40038|-2.97817|a|Sapporo Teppanyaki\nconv|53.39098|-2.96881||\nnight|53.42131|-2.96337||The Brunel\nnight|53.42982|-2.97315||The Devonshire Arms\nnight|53.40581|-2.96485||The Augustus John\nnight|53.41120|-2.98613||Borough Hotel\nrest|53.40552|-2.99323||Meet\nrest|53.40534|-2.99289|a|Etsu\nrest|53.40113|-2.97576|a|Mei Mei\nnight|53.40515|-2.99110||The Old Bank\nsuper|53.38774|-2.97987||Londis\nnight|53.38871|-2.96097||The Empress\nnight|53.38951|-2.96269||The Lothian\nnight|53.41966|-2.99986||Farmers Arms\nnight|53.41806|-2.99674||The Goat\nrest|53.41740|-2.99963||The Riverside Diner\nnight|53.39327|-2.97897||The Brewery Tap\ncafe|53.39343|-2.97814||Ryde\nnight|53.38955|-2.97323||Mosley Arms\nnight|53.38970|-2.97054||The Globe\nnight|53.40808|-2.98725||Masquerade Bar\nnight|53.40728|-2.98734||Superstar Boudoir\nnight|53.40846|-2.98872||The Navy Bar\nnight|53.40034|-2.94033||The Spofforth\nrest|53.40992|-2.99662||The Panoramic\nrest|53.40292|-2.96932||Everyman Bistro\ncafe|53.40393|-2.97754|v|The Egg Cafe\nculture|53.40414|-2.98388||The Bluecoat\nnight|53.40843|-2.97861||The North Western\ncafe|53.40211|-2.97775||Moi Bakeshop\nnight|53.40191|-2.97762||Chameleon\nrest|53.40022|-2.97140||60 Hope Street\nrest|53.42491|-2.99624|a|Tai Pan\nrest|53.41040|-2.92844||Housewives Kitchen\nrest|53.41039|-2.92937||Baja\ntake|53.41033|-2.93004|t|The Butty Mine\nnight|53.40693|-2.93108||Mango\nnight|53.39746|-2.94693||Newstead Abbey\nnight|53.40316|-2.96833||The Font\nnight|53.40134|-2.96834||Baa Bar\ncafe|53.40083|-2.96660||Kimos\nculture|53.41002|-2.97963||Walker Art Gallery\nnight|53.40191|-2.97047||Frederiks\nshop|53.40380|-2.98516||Waterstones\nshop|53.40391|-2.97224||Reid of Liverpool\nnight|53.40044|-2.97199||Ye Cracke\nnight|53.40095|-2.97040||The Shandon Bells\nrest|53.40045|-2.97074||Host\nrest|53.40087|-2.97106||The London Carriage Works\nnight|53.40181|-2.97147||The Flute\nrest|53.40040|-2.97059||The Quarter\nrest|53.40593|-2.99159||The Restaurant Bar + Grill\ncafe|53.40453|-2.99703||The Fab4 Cafe\nshop|53.40776|-2.97884||Left Luggage\nrest|53.40398|-2.98674|a|YO! Sushi\ntake|53.40405|-2.98729|t|Five Guys\nrest|53.40283|-2.98552||Bistro Franc\nrest|53.40173|-2.97093||Bistro Jacques\nrest|53.40368|-2.98701||Zizzi\nrest|53.40350|-2.98698|a|Wagamama\nrest|53.40336|-2.98701||Smoke \u0026 Dough\nrest|53.40358|-2.98699||TGI Fridays\ntake|53.40413|-2.98739|t|Jerk Junction\nrest|53.40457|-2.98706||Yee Rah\nrest|53.40378|-2.98705||Las Iguanas\nrest|53.40418|-2.98662||Nando\u0027s\nrest|53.40396|-2.98652||Pizza Hut\ntake|53.40171|-2.97082|t|Shiraz BBQ House\nculture|53.40746|-2.98115||Royal Court\nrest|53.40361|-2.98372||Lunya\ncafe|53.40147|-2.96288||\ncafe|53.40252|-2.96394||Library Cafe\ncafe|53.40194|-2.96482||\nculture|53.40222|-2.96433||Garstang Museum\nculture|53.40620|-2.96630||Victoria Gallery \u0026 Museum\nnight|53.39434|-2.97915||Arts Bar Baltic\nnight|53.41844|-2.95280||St. Michael\u0027s Irish Centre, Everton\nnight|53.40294|-2.97974||Baa Bar\nnight|53.40838|-2.98226||Doctor Duncan\u0027s\nrest|53.40832|-2.98213|a|Tso\u0027s Oriental Buffet\nculture|53.40121|-2.99322||International Slavery Museum\nculture|53.40134|-2.99275||Merseyside Maritime Museum\nrest|53.40391|-2.97235||The Reader\nrest|53.40430|-2.97584||Kimo\u0027s\nsuper|53.39784|-2.94829||Carry Fresh Super Store\nnight|53.40235|-2.97124||Hope \u0026 Anchor\nrest|53.40253|-2.97693|v|The Italian Club\nnight|53.40372|-2.98077||K1 Metal Club\ntake|53.40326|-2.97842|t|Mamos\nnight|53.40334|-2.97985||Ruby Sky\ntake|53.40336|-2.97860|t|Subway\nnight|53.40281|-2.97399||The Scholar\nnight|53.40287|-2.97493||OSQA Sports Bar\nnight|53.40218|-2.97674||Soul Cafe and Bar\nrest|53.40190|-2.97617||The Italian Club Fish Cafe\nconv|53.40451|-2.97654||Go Local Extra\nnight|53.40584|-2.97720||Wave Bar\nconv|53.41072|-2.98786||GoLocalExtra\ncafe|53.40380|-2.96874||Piazza CafÃ©\ncafe|53.40407|-2.98580||Starbucks\nrest|53.40279|-2.98587||Salt House Tapas\ntake|53.40643|-2.98852|t|The Filling Station\ncafe|53.40085|-2.96775||CaffÃ¨ Nero\nnight|53.40239|-2.96678||The Cambridge\ncafe|53.40690|-2.98487||Black Sheep Coffee\nrest|53.40121|-2.96410||Bertie \u0026 Bella\u0027s\nconv|53.40089|-2.96801||Co-op Food\nshop|53.40352|-2.94738||Home Bargains\nshop|53.40257|-2.97745||News From Nowhere\nsuper|53.42492|-2.99593|a|W H Lung\nnight|53.41219|-2.94993||The Kensington\ncafe|53.40410|-2.98404||Espresso\ncafe|53.39533|-2.98015||The Baltic Roastery\nnight|53.39519|-2.98122||District\nrest|53.40128|-2.97570|a|Tokyou\ntake|53.40409|-2.98714|t|Barburrito\nrest|53.40419|-2.98747||PizzaExpress\ncafe|53.40425|-2.98694||Costa\nnight|53.40024|-2.99102||Revolution\nrest|53.40135|-2.99183||Gusto\nrest|53.39978|-2.99100||Miller \u0026 Carter\nrest|53.40188|-2.98467||Jalon\u0027s Bridewell\nnight|53.40286|-2.98181||Kazimier Garden\nculture|53.40224|-2.97765||Picturehouse at FACT\ntake|53.40436|-2.98680|t|Greggs\nshop|53.40452|-2.98689||Dirty\nshop|53.40378|-2.96891||Cathedral Shop\nshop|53.40427|-2.98403||Aldous Books\nshop|53.40443|-2.98404||Probe Records\nrest|53.40266|-2.97718|a|Pho\nshop|53.40392|-2.97692||The Hippy Hole\nnight|53.39956|-2.96847||The Blackburne Arms\nnight|53.40021|-2.96964||The Belvedere Arms\nrest|53.39938|-2.99188||Lunya lita\nconv|53.40578|-2.96758||Tesco Express\ntake|53.40581|-2.96722|t|Greggs\ncafe|53.40582|-2.96701||Costa\nshop|53.40580|-2.96693||Ryman\nconv|53.40601|-2.96487||Oven Door Bakery\nrest|53.39987|-2.99375||Docklands Fish \u0026 Chips\ncafe|53.40247|-2.97681||Bold Street Coffee\nconv|53.40060|-2.97640||Euro Wines\nconv|53.39895|-2.97645||L1 Mini Market\nrest|53.39903|-2.99286||What\u0027s Cooking\nrest|53.39926|-2.99225|at|Rosa\u0027s Thai Cafe\nrest|53.39920|-2.99244||The Botanist\nconv|53.40601|-2.96472||Life Express\ncafe|53.39754|-2.97284||Mezzanine CafÃ© Bar\nrest|53.39750|-2.97284|v|The Welsford\ncafe|53.40565|-2.98085||Costa\nrest|53.40737|-2.98743|s|Spice City\nnight|53.40766|-2.98778||Boutique\nconv|53.40842|-2.98788||Tesco Express\nconv|53.40319|-2.97829||Matta\u0027s\ncafe|53.39681|-2.98200||Baltic Bakehouse\ncafe|53.40818|-2.99245||Costa\nrest|53.40804|-2.99193||Fogo dev chao\ncafe|53.40743|-2.99238||Esquires Coffee\ntake|53.40756|-2.99073|t|Subway\nconv|53.40535|-2.98175||Tesco Express\nshop|53.40521|-2.98206||EE\nculture|53.40563|-2.99121||Laughterhouse\nrest|53.40547|-2.99103||Manhattan\nrest|53.40125|-2.97728|a|Mr. Chilli\nrest|53.40213|-2.97139|s|Remora\nshop|53.40338|-2.98665||Utility\nrest|53.40292|-2.98824||Bill\u0027s\ncafe|53.40078|-2.99141||Teddy\u0027s\ncafe|53.40902|-2.99360||Starbucks\ntake|53.41806|-2.98971|t|Jimmy\u0027s Fresh Fry\nconv|53.41813|-2.98970||J Flemming and Sons\nrest|53.41115|-3.00160||Cargo\ncafe|53.40621|-2.96620||\nconv|53.41843|-2.99129||Eldonian Village Stores\nnight|53.40277|-2.96952||The Pen Factory\nnight|53.40503|-2.96643||The Sphinx\ncafe|53.40816|-2.98040||\nrest|53.40245|-2.97677||Maray\nsuper|53.40082|-2.96669|a|Sida Express\nrest|53.40134|-2.97077||1931 Restaurant\ncafe|53.40155|-2.96954||Starbucks\nnight|53.40161|-2.97000||The Queen of Hope Street\ntake|53.40077|-2.96782|t|Greggs\nrest|53.40313|-2.97814|a|Ban Di Bul Korean Restaurant\ncafe|53.40421|-2.98036||CaffÃ¨ Nero\ntake|53.40171|-2.97270|t|City Fish and Chips\ntake|53.40174|-2.97294|t|Dory\u0027s\nrest|53.40242|-2.97603||Tiger Rock\nconv|53.40173|-2.97280||Hardman\u0027s Off License\ntake|53.40376|-2.97943|t|Greggs\nrest|53.40402|-2.98041||Pizza Punks\nrest|53.40197|-2.97258|a|Centreline Canteen\nrest|53.40269|-2.97724||Kassap Meat House\nrest|53.40283|-2.97751|sv|Mowgli Street Food\nrest|53.40316|-2.97821||Raggas\nconv|53.40659|-2.97992||Sainsbury\u0027s Local\nrest|53.40148|-2.97137||The Old Blind School\nshop|53.40389|-2.98422||Tattigrass\nrest|53.40238|-2.97052||Free State Kitchen\ntake|53.40398|-2.98296|t|Subway\nrest|53.40368|-2.98398||Mamasan\nnight|53.40675|-2.97753||Dough Bar\ntake|53.40210|-2.97392|t|Hot n\u0027 tender\nrest|53.40410|-2.97427||The Palm\nrest|53.40422|-2.97548|t|Peppers\u0027\ntake|53.40204|-2.97639|t|American Pizza Slice\nrest|53.40156|-2.97180||Grilla\ncafe|53.40395|-2.97289||Pumpernickle\u0027s\ncafe|53.40144|-2.97081||92Â°\nshop|53.40381|-2.98763||Stradivarius\nshop|53.40364|-2.98755||Skechers\nconv|53.41032|-2.96858||Best-one\ntake|53.41002|-2.96893|t|Domino\u0027s\ngym|53.41073|-2.96804||Momentum Leisure\nconv|53.41073|-2.96516||Spar\ncafe|53.40824|-2.96563||\nconv|53.41086|-2.96360||Tesco Express\ncafe|53.41071|-2.96544||Starbucks\ntake|53.41070|-2.96558|t|Papa John\u0027s\ntake|53.41082|-2.96407|t|Pizza Hut Delivery\nrest|53.41061|-2.96645|a|Buffet Club\ntake|53.41078|-2.96456|t|Greggs\nnight|53.40508|-2.96619||Courtyard Bar\nconv|53.40522|-2.96641||UoL Guild Shop\ncafe|53.40539|-2.96626||Starbucks\nconv|53.40060|-2.96485||Tesco Express\ntake|53.40094|-2.96415|t|Subway\nnight|53.40600|-2.97775||Riley\u0027s Sports Bar\nrest|53.40107|-2.96887||The Art School Restaurant\ncafe|53.40319|-2.98749||Starbucks\ntake|53.40775|-2.98372|t|Five Guys\nnight|53.40299|-2.98827||Bierkeller\ngym|53.40488|-2.97819||PureGym\ntake|53.40490|-2.98128|th|McDonald\u0027s\nrest|53.40778|-2.98344||Nando\u0027s\ncafe|53.40342|-2.98653||Black Sheep Coffee\ntake|53.40347|-2.98642|t|Pret A Manger\nrest|53.40355|-2.98918|a|Chaophraya\nshop|53.40351|-2.98634||Goldsmiths\nnight|53.40371|-2.98884||Thaikhun\nshop|53.40358|-2.98575||Urban Outfitters\nnight|53.40366|-2.98383||Roxy Ball Room\nshop|53.40337|-2.98744||Zara\nrest|53.40391|-2.98315||Turtle Bay\nshop|53.40419|-2.98580||The North Face\nshop|53.40425|-2.98580||KIKO Milano\nshop|53.40460|-2.98579||Schuh\nshop|53.40445|-2.98579||FootAsylum\nshop|53.40439|-2.98579||Vans\nshop|53.40413|-2.98580||MAC Cosmetics\nshop|53.40432|-2.98579||Dr. Martens\nnight|53.40485|-2.97764||Ava\u0027s Bar\nnight|53.39658|-2.96747||Peter Kavanagh\u0027s\nnight|53.40226|-2.97675||LâAperitivo\nnight|53.40627|-2.98790||Cavern Club\nnight|53.40207|-2.97339||Mackenzies\ncafe|53.40398|-2.98033||Cafe Latino\nnight|53.40195|-2.97617||Bar Tabac\nshop|53.40230|-2.97684||Pop Boutique\nrest|53.40262|-2.97711||\nshop|53.40374|-2.97909||Dig Vinyl\ncafe|53.40175|-2.97972||Brink\ntake|53.40178|-2.98001|t|Almost Famous\ncafe|53.39604|-2.97938||Coffee and Fandisha\nshop|53.39360|-2.97839||Red Brick Vintage\nnight|53.40240|-2.98404||Filter and Fox\nrest|53.40323|-2.97836||Toros Steakhouse\ngym|53.40574|-2.98017||The Gym\ntake|53.40674|-2.98463|t|American Pizza Slice\nnight|53.40023|-2.97653||Petit Cafe du Coin\nculture|53.40372|-2.99365||Open Eye Gallery\nrest|53.40143|-2.97603|a|Big Bowl Noodles\nshop|53.40358|-2.97916||Resurrection\nrest|53.40954|-2.97113||Mr Chilli 2\nrest|53.40355|-2.97905||Elif\nshop|53.40367|-2.97701||Lucca\nrest|53.40491|-2.98148||Wildwood\ncafe|53.39898|-2.97797||The Bagelry\nnight|53.40227|-2.98342||The Brunch Club\ntake|53.40210|-2.97385|t|Nabzys\nrest|53.40687|-2.99101||Rudys\ntake|53.40468|-2.98075|t|Burger King\ntake|53.40478|-2.98059|t|Popeyes\ntake|53.40487|-2.98018|t|KFC\nshop|53.40469|-2.98029||Ethel Austin\nconv|53.40478|-2.98014||Snack\u0026Bargain\ntake|53.40464|-2.98019|t|Greggs\ncafe|53.40458|-2.98005||92 Degrees Coffee\ntake|53.40493|-2.97979|t|Subway\ntake|53.40498|-2.97962|t|Archie\u0027s\nconv|53.40462|-2.97986||Sainsbury\u0027s Local\nshop|53.40458|-2.97974||CeX\nnight|53.40696|-2.98240|v|The Fall Well\nrest|53.40638|-2.99129|s|Elif\ntake|53.40652|-2.99077|t|Greggs\ncafe|53.40156|-2.98523||Cow \u0026 Co\ngym|53.41287|-2.97026||Salisbury Amateur Boxing Club\nshop|53.40596|-2.98450||Slaters\nconv|53.40928|-2.99467||Tesco Express\nrest|53.40180|-2.98434||Amalia\nnight|53.40313|-2.98004||Boston Pool Loft\ncafe|53.40674|-2.98258||CaffÃ¨ Nero\nnight|53.40638|-2.98817||Cavern Pub\nnight|53.40642|-2.98743||Rubber Soul\nnight|53.40643|-2.98723||Lennon\u0027s Bar\nnight|53.40680|-2.98825||OMG\ntake|53.40492|-2.97767|t|Chicken Bazooka\nrest|53.40490|-2.97756||Best Kebab - FIsh and Chips\nshop|53.40680|-2.98314||Matalan\nrest|53.40407|-2.97409||Cravings\nnight|53.40376|-2.97407||Voodoo Lounge\nrest|53.40389|-2.97187||Taste of the underground\nshop|53.40643|-2.98490||Barnardo\u0027s\ntake|53.40650|-2.98466|t|Go Falafel\ntake|53.40523|-2.98654|t|Tortilla\nrest|53.40250|-2.97322||Cafe Porto\nshop|53.40685|-2.98452||L1 Phone Exchange\ncafe|53.40524|-2.98634||CaffÃ¨ Nero\ntake|53.40495|-2.97972|t|Wok \u0026 Go\nconv|53.40396|-2.97747||The Italian Club Bakery\ntake|53.40200|-2.97296|t|Subway\nrest|53.40243|-2.97324||RÃ¶ski\ntake|53.40660|-2.98462|at|Ichi Noodle\ntake|53.42886|-2.96707|t|Lucky Fryer\nconv|53.42257|-2.96908||One Stop\nconv|53.40218|-2.97466||Co-op Food\ntake|53.40064|-2.96545|t|KFC\nsuper|53.40062|-2.96532||Heron Foods\nshop|53.40398|-2.98770||Card Factory\nshop|53.40430|-2.98781||Lefties\nshop|53.40406|-2.98773||Victoria\u0027s Secret\nshop|53.40366|-2.98629||Levi\u0027s\nshop|53.40355|-2.98750||The Vintage Shop\nshop|53.40390|-2.98767||Lego\nnight|53.39707|-2.98213||black lodge brewing\nrest|53.40513|-2.99298||Silk Road\nrest|53.40232|-2.98623||Churrasco Steakhouse\nrest|53.40569|-2.99018||Bacaro\nrest|53.40638|-2.99067||Castle St Townhouse\nrest|53.40694|-2.99094||Riva Blu\nrest|53.40786|-2.99104|s|Barton Rouge\nshop|53.41000|-2.98953||Just Play\nrest|53.40595|-2.99025||San Carlo\ncafe|53.40619|-2.98943||Cook Street Coffee\nrest|53.40758|-2.98548|a|Mei Zhen\nrest|53.40855|-2.98383|s|Sultan\u0027s Place\nnight|53.40828|-2.97645||Castaway\nshop|53.40729|-2.98699||T Nutrition\ncafe|53.40870|-2.98347||Roots\nnight|53.40759|-2.98091||Courtyard\ntake|53.40823|-2.99322|t|Pret A Manger\nrest|53.40845|-2.99183||On The Vine\nnight|53.40844|-2.99099||Tempest on Tithebarn\ntake|53.41143|-2.98791|t|Marybone Fish \u0026 Chips\nconv|53.41092|-2.98696||Tesco Express\ngym|53.41129|-2.98566||HEAL Studios\ncafe|53.40680|-2.98005||Key Lime Coffee\nshop|53.40654|-2.97893||Solarsun\ncafe|53.40802|-2.99294||Out to Lunch\nnight|53.40900|-2.98547||Dead Crafty Beer\ncafe|53.40647|-2.99346||In A Big Pond\ncafe|53.40878|-2.98384||Lovelocks\nrest|53.40357|-2.97910|v|Pieminister\nrest|53.40309|-2.97807||La Parrilla\ncafe|53.40551|-2.99247||Philpotts\ncafe|53.40642|-2.98025||Mangobean\nrest|53.40368|-2.97927||Crust\nshop|53.40752|-2.99066||Mail Boxes Etc\ncafe|53.40712|-2.99061||Moose Coffee\nrest|53.40708|-2.98901||NYL\nrest|53.40590|-2.98816||Blakes\nshop|53.40426|-2.98762||Three.\nshop|53.40362|-2.98763||Oliver Bonas\nshop|53.40427|-2.98756||The Perfume Shop\nshop|53.40443|-2.98759||H.Samuel\nshop|53.40387|-2.98745||Rituals\nshop|53.40335|-2.98718||Ernest Jones\nshop|53.40370|-2.98757||Russell \u0026 Bromley\nshop|53.40353|-2.98727||Samsung\ncafe|53.40634|-2.99410||Bite\ncafe|53.40620|-2.99417||Cafe Lucaya\ncafe|53.40774|-2.99161||Philpotts\nrest|53.40723|-2.99025||Changos\nnight|53.40648|-2.98833||Wall of Fame\nshop|53.40416|-2.98759||The Fragrance Shop\nshop|53.40410|-2.98756||Office\nshop|53.40373|-2.98730||Pull \u0026 Bear\nnight|53.40784|-2.99247||Black Cat Club\nrest|53.40780|-2.99143||Lebatish\ncafe|53.40747|-2.99061||Lucy in the Sky\nshop|53.40345|-2.98715||Apple Store\nrest|53.40591|-2.98867|a|Tiger Rock\nshop|53.40411|-2.98748||Pop Mart\nshop|53.40403|-2.98745||Under Armour\nshop|53.40389|-2.98738||New Look\nshop|53.40357|-2.98760||Kick Game\nshop|53.40368|-2.98766||The Body Shop\nshop|53.40389|-2.98776||Bershka\nshop|53.40380|-2.98741||Mini Sou\nshop|53.40346|-2.98724||Pandora\nshop|53.40437|-2.98761||Acce\nshop|53.40371|-2.98737||Boux Avenue\nshop|53.40348|-2.98756||Boux Avenue\nnight|53.40794|-2.98830||Ghoulies Horror Bar\nnight|53.40050|-2.97644||Bunch\nshop|53.40033|-2.97651||Beauty Box\nrest|53.40034|-2.97604||Meat Me\ntake|53.40154|-2.97601|t|Krunchy Fried Chicken\nnight|53.40407|-2.97699||Grand Central\nnight|53.40173|-2.97287||Tom Thumb\nconv|53.40069|-2.97636||Bon Bon Bakery\nculture|53.39978|-2.97365||The Hardmans\u0027 House\nrest|53.40040|-2.97648|a|Yummi Thai\nnight|53.40015|-2.97610|v|Chamber 36\nnight|53.40108|-2.97629||Danny Cs Distillery \u0026 Bar\nrest|53.40417|-2.98075||Albert\u0027s Schloss\nnight|53.39765|-2.93736||The Ashdale\nconv|53.41713|-2.97174||Everydayz â The Brow\nshop|53.40361|-2.98723||\u0026 Other Stories\nshop|53.40402|-2.98752||Kenji\nshop|53.40475|-2.98036||Christopher James\ngym|53.40287|-2.98989||The Gym\ncafe|53.40279|-2.98993||Heavenly Desserts\nnight|53.40113|-2.96909||Music Room\ncafe|53.40396|-2.98693||Sblended\nrest|53.40930|-2.99220|sv|Sankruti\ncafe|53.40981|-2.98082||Deli Marche\ncafe|53.41008|-2.97964||Art Gallery Cafe\nnight|53.40054|-2.97642||Berry \u0026 Rye\nnight|53.40252|-2.98084||PHASE one\ntake|53.40436|-2.98652|t|Auntie Anne\u0027s\nnight|53.40592|-2.99402||Africa House Roof Bar\nculture|53.40750|-2.99324||Western Approaches\nshop|53.40202|-2.98046||Lost Art\nshop|53.40593|-2.98122||Beaverbrooks\nshop|53.40417|-2.98028||Card Factory\nrest|53.39872|-2.97787|a|New Capital\nrest|53.40205|-2.97710||\ncafe|53.40081|-2.97066||Moose Coffee\nnight|53.40372|-2.97937||Bundobust\nnight|53.40440|-2.98214||Head of Steam\nnight|53.39346|-2.98086||Gibberish\nnight|53.39780|-2.98302||Black Lodge Brewery\nnight|53.40360|-2.98060||Lanigans of Wood Street\nnight|53.39362|-2.97802||Peaky Blinders Liverpool\ntake|53.40522|-2.98684|t|Greggs\nnight|53.39691|-2.98115||Hobo Kiosk\nrest|53.40120|-2.97194||Oktopus\nnight|53.40129|-2.97208||Buyers Club\nshop|53.42330|-2.95778||Bargain World\nshop|53.42340|-2.95753||British Red Cross\nnight|53.39393|-2.97907||Birdie\u0027s Bar and Barbeque\nconv|53.41375|-2.98474||Echo Shop\nlib|53.41130|-2.98843||Avril Robarts Library - LJMU\ncafe|53.41258|-2.98081||Core Cafe at Byrom Street\ntake|53.40691|-2.98063|at|Chopstix\ntake|53.40685|-2.98052|t|Subway\ntake|53.40680|-2.98048|t|McDonald\u0027s\ntake|53.40675|-2.98048|t|KFC\ncafe|53.40506|-2.97260||Starbucks\ntake|53.41222|-2.98848|t|Manhattan Liverpool\ncafe|53.41211|-2.98124||Starbucks\nlib|53.40282|-2.97194||Aldham Robarts Library\nconv|53.40690|-2.97835||Tesco Express\nconv|53.39905|-2.98695||Tesco Express\ncafe|53.40273|-2.97967|v|Potts Coffee\ncafe|53.40254|-2.97749|v|Next to Nowhere Cafe\nrest|53.40371|-2.97934||K O Authentic Eastern Grill\ncafe|53.40585|-2.96443||CaffÃ¨ Nero\ntake|53.40604|-2.96417|t|Subway\ncafe|53.40601|-2.96467|a|Jidong\nrest|53.40347|-2.99447||Brasco Lounge\ncafe|53.40643|-2.97493||Core CafÃ© - Copperas Hill Eatery\ncafe|53.40065|-2.96421||92 Degrees\nshop|53.40986|-2.98197||The Shop\ncafe|53.40997|-2.98197||The CafÃ©\ncafe|53.40219|-2.98652|v|The Vibe\nshop|53.40383|-2.98388||Florianni\nnight|53.40297|-2.97982||Black Rabbit\ntake|53.40075|-2.97632|t|Hot Chilis\nsuper|53.40056|-2.96574|a|eJoy Asian Foods\nrest|53.40083|-2.96645||Mr Zhang\u0027s Kitchen\nconv|53.40227|-2.96837||The Wild Loaf\nnight|53.40042|-2.97891||A Tavola\nrest|53.39652|-2.94373||Kurdish Restaurant Real Taste\ntake|53.39639|-2.94995|t|Shawarma lodge lane\nconv|53.39719|-2.93575||Babylon store\nrest|53.40279|-2.97630||Hibiki\nnight|53.39948|-2.99163||The One O\u0027Clock Gun\nshop|53.40554|-2.98715||H\u0026M HOME\nshop|53.40364|-2.97922||Dig Record Store\nnight|53.41048|-2.97016||Commune\nculture|53.40718|-2.98644||Everyman\ngym|53.40881|-2.93348||JD Gyms\ncafe|53.40410|-2.98014||Chaiiwala\ncafe|53.39673|-2.97965||Ryde Cycle cafe\nrest|53.40169|-2.97077|s|Labranda Turkish BBQ Bar \u0026 Grill\nconv|53.40173|-2.97101||Philharmonic Mini Market\nconv|53.42571|-2.98640||MP Food News \u0026 Wine Store\ntake|53.42577|-2.98641|t|Vaughn\u0027s Sandwich Bar\ntake|53.40524|-2.98644|t|Wingstop\ntake|53.40522|-2.98694|t|KFC\ntake|53.38943|-2.97031|t|Kevin\u0027s Fish and Chips\nconv|53.38939|-2.97029||Park Road Newsagent and General Store\nculture|53.40443|-2.98230||Epstein Theatre\nrest|53.40650|-2.98792||Turtle Bay\nrest|53.40644|-2.98806||The Cavern Restaurant\nnight|53.40645|-2.98735||Kaiserkeller\nnight|53.40643|-2.98753||King John\nnight|53.40670|-2.98753||Heaven\nnight|53.40625|-2.98776||Flares\ntake|53.40119|-2.97615|st|Botan\ntake|53.40114|-2.97616|t|Pizza King\nnight|53.40233|-2.97248||The Baltimore\ncafe|53.40252|-2.97243||Avenues\nconv|53.40703|-2.98087||\nconv|53.40671|-2.98052||Cake Box\nconv|53.39955|-2.99143||Rough Handmade\nshop|53.40262|-2.97981||R Jackson \u0026 Sons\nrest|53.40698|-2.98634||GPO Food Court\nnight|53.40732|-2.98690||The Lisbon\ntake|53.40397|-2.98709|t|Slim Chickens\ncafe|53.41021|-2.98711||Costa\nrest|53.41016|-2.98703|s|Fattoush\ntake|53.42428|-2.93471|t|KFC\nsuper|53.42445|-2.93405||Heron Foods\ntake|53.40450|-2.98141|t|The F* Word\nshop|53.40374|-2.98629||Morphe\ntake|53.40272|-2.98765|t|Chips a gogo\nshop|53.40361|-2.98731||EE\nrest|53.40229|-2.97545||Renshaw Street Food Market\nshop|53.40880|-2.93222||The Range\nrest|53.40184|-2.97595|a|MÃ©Ä Japanese and Thai Street Food\nconv|53.41103|-2.95989||Mohan Mini Market\nrest|53.40006|-2.97604|a|Yuet Ben\nnight|53.40311|-2.98174||Zodiac\nnight|53.40314|-2.98149||Be At One\nnight|53.40301|-2.98146||54 Liverpool\nnight|53.40294|-2.98125||Indies\nnight|53.40304|-2.98127||Sensations\ncafe|53.40896|-2.98556||Carlisi\nshop|53.40392|-2.98747||ThÃ©rapie Clinic\nnight|53.40343|-2.98699||Brewski\nnight|53.40128|-2.97773||NQ64\nnight|53.40672|-2.98841||Jaloux\nnight|53.40674|-2.98835||Dorothy\u0027s Showbar\nshop|53.40390|-2.98576||Charlotte Tilbury\nnight|53.40546|-2.99347||Three Graces\nnight|53.40553|-2.99339||Noir\nnight|53.40555|-2.99332||LibertÃ© Sky Garden\ncafe|53.42804|-2.98240||Rotunda Cafe Bistro\ntake|53.40491|-2.97990|t|Merigo\nnight|53.40579|-2.97933||Central Sports\nshop|53.40453|-2.98578||Schuh\nshop|53.40393|-2.98628||Hugo Boss\ncafe|53.40233|-2.97692||Bamboo\nshop|53.40209|-2.98620||Merseymade\ncafe|53.40036|-2.99410||Rubens\ncafe|53.40019|-2.99397||Costa\nshop|53.40028|-2.99405||Pride of Liverpool\nrest|53.40005|-2.99387||Pasta Cosa\nshop|53.39998|-2.99382||Harbour Accessories\nrest|53.39976|-2.99364||Porters\nshop|53.39969|-2.99359||With Love from Liverpool\nshop|53.39962|-2.99356||The Nest\nshop|53.39957|-2.99352||Natures Treasure\nshop|53.39954|-2.99350||Liverpool Pictures\ncafe|53.39940|-2.99340||Peaberry Coffee House\nrest|53.39930|-2.99215||Rudy\u0027s\nrest|53.39943|-2.99176||Maray\nshop|53.40464|-2.98389||Castle Fine Art\nconv|53.42775|-2.98304||Kirkdale General Store\nculture|53.41715|-2.99481||Quarry Venue\ncafe|53.40150|-2.98514||Thoughtfully Cafe\nshop|53.40209|-2.98613||MerseyMade\ncafe|53.40210|-2.98614||Scribble CafÃ©\ntake|53.40582|-2.96713|t|Subway\nshop|53.40404|-2.98000||British Heart Foundation\nsuper|53.40613|-2.98057|a|Seoul Plaza\ncafe|53.40382|-2.97714||Hardware Coffee and Kitchen\nsuper|53.40246|-2.97558||Misu\ntake|53.40499|-2.96626|t|The Courtyard\nconv|53.39724|-2.98036||Go Local\nnight|53.39671|-2.98141||Duck \u0026 Swagger\nconv|53.39714|-2.98306|h|Baltic Express\ncafe|53.40551|-2.98745||Rocco\nnight|53.40402|-2.98231||McCartneys Bar\ngym|53.40459|-2.98851||Gravity MAX\nshop|53.40281|-2.97744||Shared Earth\ncafe|53.40946|-2.98966||Hemingways\nconv|53.41558|-3.00197||Carmine Italian Bakery\nconv|53.40908|-2.99814||Sainsbury\u0027s Local\ncafe|53.40897|-2.99806||Bean\ncafe|53.41024|-2.99909||Moose Coffee\nrest|53.40240|-2.97553|a|\nconv|53.40074|-2.97592||Liverpool One Convenience Store\nrest|53.40070|-2.97593||Fluffy Fluffy\ntake|53.39194|-2.94957|t|Bala B\u0027s\nconv|53.39198|-2.94956||Lodge Lane Mini Mart\nconv|53.39202|-2.94956||Local Pound Store\nnight|53.40265|-2.97002||Arts Bar Hope Street\nshop|53.39524|-2.94964||Pound Power\ncafe|53.39514|-2.97695||Parliament Square Coffee\ncafe|53.40439|-2.98114||Cat CafÃ©\nrest|53.40242|-2.99076||Daffodil\nrest|53.41056|-2.96746|a|LiangJi Wraps\nconv|53.42166|-2.98212||Go local\nnight|53.40372|-2.97752||Little Hardware\nconv|53.40328|-2.97885||Premier 64\nnight|53.40221|-2.98130||Sister Ray\nnight|53.40722|-2.98961||Hummingbird\nnight|53.40553|-2.99148||Jenny\u0027s\nnight|53.40110|-2.97636||Detour\nrest|53.40157|-2.98154||Love 66\nrest|53.41548|-2.98871||Blackstock Market\nshop|53.41391|-2.98933||Dofas\nrest|53.41414|-2.98940||Goodness Grill \u0026 Rotisserie\nconv|53.41437|-2.99002||Everydayz\nnight|53.40219|-2.97739||Pixel Bar Liverpool\ncafe|53.40753|-2.97886||92 Degrees\nrest|53.39951|-2.99153|s|Delhi House Cafe\nculture|53.40348|-2.99365||Tate Liverpool\nculture|53.40351|-2.99365||RIBA North\nculture|53.40150|-2.99245||Seized! The Border and Customs uncovered\nrest|53.39477|-2.97684|a|Le Viet Social\ncafe|53.39585|-2.98116||Open Coffee\ncafe|53.40257|-2.97829||Mother Expresso\ncafe|53.40253|-2.97252||Small Town Boy\ncafe|53.40110|-2.97246||Coffi\ncafe|53.42340|-2.93506||\nnight|53.40731|-2.98965||The Lockup Bar\nshop|53.40474|-2.98758||Phase Eight\nshop|53.40465|-2.98759||Sephora\nshop|53.40474|-2.98751||Inside Story\nrest|53.40588|-2.99086|a|Spice Thai\nrest|53.40620|-2.99051||The Ivy\nshop|53.40480|-2.98812||Dave M Robinson\nshop|53.40480|-2.98761||Hobbs\nshop|53.40480|-2.98753||Whistles\ncafe|53.40450|-2.98810||M\u0026S CafÃ©\nsuper|53.40460|-2.98817||M\u0026S Food\nshop|53.40383|-2.98743||Bath \u0026 Body Works\nshop|53.40412|-2.98776||Hollister\nrest|53.40371|-2.98577||Cosy Club\ncafe|53.40425|-2.98333||Quakers Cafe\nshop|53.40355|-2.98499||Red Run\nsuper|53.40390|-2.98255||Blue Whale Supermarket\nnight|53.40438|-2.98053||One Under\nconv|53.40415|-2.98215||\nshop|53.40377|-2.98280||Rough Trade\ntake|53.40412|-2.98018|at|Aka Sushi\nconv|53.40659|-2.98520||Tesco Express\nshop|53.40653|-2.98566||All Over The Shop\ncafe|53.40811|-2.98299||Paper Cup Coffee\nrest|53.40792|-2.98321||Copacabana\nshop|53.40683|-2.98335||HMV\ncafe|53.40667|-2.98515||200 Degrees Coffee Shop\nnight|53.40066|-2.99134||Turncoat Bar\ncafe|53.39940|-2.99108||Fab4cafe\nnight|53.39932|-2.99130||The Long Shot\nshop|53.39903|-2.99320||House Of Spells\nnight|53.40426|-2.98246||Lounge 69\ncafe|53.40406|-2.98280||Frevo\nnight|53.40220|-2.97768||\ncafe|53.40332|-2.97906||Joe \u0026 The Juice\nnight|53.39354|-2.97913||The Punch Tarmeys\ntake|53.40008|-2.99389|t|Francieâs Focaccia \u0026 Coffee\ntake|53.40008|-2.99389|t|Francieâs Focaccia \u0026 Coffee\nconv|53.40298|-2.98201||Castros\nrest|53.40357|-2.98273||Chico Brazil\nconv|53.39288|-2.98234||Albert Dock Mini Market\ntake|53.39456|-2.97760|t|Marty\u0027s\nrest|53.40153|-2.99320|s|Chef Yasin\ncafe|53.40385|-2.97963|v|200 Degrees\nconv|53.41404|-2.93511||Baltika\nshop|53.41062|-2.97159||The Gamers Lodge\nconv|53.41209|-2.95119||\nconv|53.40208|-2.93580||\ntake|53.40206|-2.93573|at|\ncafe|53.41560|-3.00168||Gran Caffe\nconv|53.40717|-2.98258||Greggs\nconv|53.40618|-2.98443||Melo\u0027s\ncafe|53.40740|-2.98142||38\nrest|53.39081|-2.98462||Anchor Restaurant\nconv|53.38922|-2.95966||Tonys Pound Shop\nconv|53.39450|-2.97797||Asda\nnight|53.40065|-2.97595||Vox\nrest|53.40503|-2.98172|a|Noodle Bar\nshop|53.40602|-2.98131||Sixty Six\nshop|53.40612|-2.98144||Warhammer\nshop|53.40616|-2.98150||Ryman\ntake|53.40620|-2.98154|t|Greggs\nshop|53.40623|-2.98159||Warren James\nnight|53.39363|-2.97740||The Garden\nrest|53.40407|-2.97290||Wang\u0027s Dumplings\ncafe|53.40274|-2.99524||NML CafÃ©\nnight|53.40526|-2.99078||McSwiggins\nshop|53.40535|-2.98359||Sports Direct\nnight|53.40501|-2.99153||Baby Temple\nrest|53.40746|-2.99530||Vista Restaurant\nrest|53.40656|-2.99209||Gaucho\nrest|53.40626|-2.99119|a|Pho\nconv|53.40500|-2.98160||Times Square\nshop|53.40646|-2.98653||Lyver Gifts\nconv|53.40609|-2.98876||Nisa\nshop|53.40597|-2.98870||Stephen Jones\nnight|53.40734|-2.99527||Vu Terrace \u0026 Bar\nshop|53.40439|-2.98710||Lovisa\ntake|53.40928|-2.99394|t|Greggs\nshop|53.40845|-2.99332||Nails By Feryal \u0026 Co\ncafe|53.40863|-2.99354||Mangetout\nnight|53.40878|-2.99380||City Wine Bar\ncafe|53.40961|-2.99516||Gino D\u0027acampo\nnight|53.40967|-2.99549||360 Sky Bar\nconv|53.40993|-2.99584||Nisa Local\ncafe|53.40989|-2.99538||Kona\ncafe|53.40778|-2.99417||Bean Coffee Roaster\nshop|53.40632|-2.98392||Mind\ncafe|53.40278|-2.98728||Ori\ntake|53.40316|-2.98235|t|Pipi Pino\ncafe|53.40346|-2.99433||Nova Scotia\ntake|53.40346|-2.99418|t|Doogles\ncafe|53.40459|-2.98388||Tabithaâs Coffee\ncafe|53.40260|-2.98329||Kiku\nrest|53.41058|-2.97165|v|Guac \u0027n\u0027 Roll Kitchen\nnight|53.40388|-2.98843||Lorettas\ncafe|53.40434|-2.98668||My Cookie Dough\nshop|53.40645|-2.98649||The Beatles Shop\nshop|53.40593|-2.98468||Williamson Street\nshop|53.40339|-2.94354||Matalan\nsuper|53.40479|-2.95480||Tesco\nshop|53.40687|-2.98589||Metquarter\nshop|53.40284|-2.98683||John Lewis\ngym|53.40380|-2.96637||Sports and Fitness Centre\nlib|53.40676|-2.96568||Harold Cohen Library\nnight|53.40490|-2.97662||Club 051\nlib|53.40249|-2.96350|h|Sydney Jones Library\nculture|53.39926|-2.97677||The Black-E\nculture|53.40115|-2.96973||Philharmonic Hall\nshop|53.40674|-2.98115||St John\u0027s Shopping Centre\nrest|53.39840|-2.99039|t|PizzaExpress\nculture|53.40297|-2.99558||Museum of Liverpool\nculture|53.40649|-2.98243||The Playhouse\nnight|53.40183|-2.99205||The Pump House\ngym|53.42437|-2.97759||Lifestyles Everton Park\nnight|53.40254|-2.97937||The Shipping Forecast\nnight|53.40216|-2.97419||Bock Biere Cafe\nconv|53.40244|-2.97652||Tesco Express\nnight|53.40260|-2.97563||The Dispensary\nnight|53.40901|-2.99041||The Lion Tavern\nshop|53.41319|-2.99856||Home Bargains\ngym|53.42467|-2.97619||Lifestyles Everton Park\nsuper|53.40950|-2.97038||Lidl\nnight|53.40141|-2.97646||MOJO\nculture|53.40221|-2.97786||FACT\ntake|53.39629|-2.98437|th|McDonald\u0027s\nnight|53.39439|-2.98041||Camp and Furnace\nnight|53.39276|-2.98209||The Coburg\nconv|53.38671|-2.98030||Delifonseca Dockside\nnight|53.40426|-2.94792||Durning Arms\nshop|53.41221|-2.96746||\nshop|53.40570|-2.98537||Next\nshop|53.40544|-2.98098||Clayton Square Shopping Centre\ncafe|53.40509|-2.98053||Starbucks\ncafe|53.40510|-2.98215|a|Heytea\nshop|53.41006|-2.97154||Home Bargains\nshop|53.40478|-2.98851||Marks \u0026 Spencer\nnight|53.40605|-2.98699||Roxy Ball Room\nshop|53.40609|-2.98759||Cavern Walks\nnight|53.40345|-2.97954||Coyote Ugly\ncafe|53.40168|-2.97936||Sheba Lounge\nnight|53.40177|-2.97950||Black Cat Parr Street\nnight|53.40375|-2.98088||Diego\u0027s Demise\nrest|53.40339|-2.97939|s|Bakchich\nshop|53.40331|-2.97922||Take 2\nshop|53.40356|-2.97879||Oxfam\nrest|53.40335|-2.97931||So Salsa\ngym|53.40696|-2.98984||JD Gyms\nsuper|53.41150|-2.94494||Lidl\ntake|53.41204|-2.94481|t|McDonald\u0027s\nrest|53.41181|-2.94736|s|The Picture Drome Akshaya\nsuper|53.41195|-2.94701||Green Leaf\nrest|53.41195|-2.94662||Ge\u0027ez\nnight|53.41195|-2.94765||The New Holt\nshop|53.41197|-2.95396||Snowy\u0027s\nshop|53.41197|-2.95381||Ku\nlib|53.41158|-2.95344||Kensington Library\nconv|53.41211|-2.94355||Continental Sun Market liverpool\nnight|53.41242|-2.94259||Lister Hotel\ntake|53.41265|-2.94305|at|Alan\u0027s Kitchen\nshop|53.41263|-2.94319||Phone Tech\nnight|53.41208|-2.95156||The Vinebrook\nculture|53.40891|-2.97818||Liverpool Empire Theatre\nnight|53.40860|-2.97774||Ma Egertons\nculture|53.40871|-2.97660||O2 Academy Liverpool\nnight|53.40178|-2.97055||Philharmonic Dining Rooms\nnight|53.40732|-2.98387||Yates\nshop|53.40529|-2.98278||Pandora\nshop|53.40544|-2.98279||TK Maxx\nshop|53.40541|-2.98238||Austen \u0026 Blake\nshop|53.40579|-2.98188||Flannels\nshop|53.40534|-2.98253||Ernest Jones\nshop|53.40537|-2.98246||Lovisa\nshop|53.40474|-2.98320||Primark\nnight|53.40250|-2.96961||White Hart\nnight|53.40202|-2.97230||Fly in the Loaf\nshop|53.40549|-2.98467||Vodafone\nrest|53.40630|-2.98385||Gran Caffe\ntake|53.40633|-2.98410|t|Greggs\nshop|53.40498|-2.98519||River Island\nnight|53.40643|-2.98441||Richmond Pub\ncafe|53.40578|-2.98416||Wake \u0026 Cate\ncafe|53.40608|-2.98405||Bramleys\nshop|53.40497|-2.98554||The Works\nshop|53.40485|-2.98428||Foot Locker\nshop|53.40553|-2.98436||Clarks\nshop|53.40563|-2.98496||TJ Hughes\nshop|53.40543|-2.98419||Kurt Geiger\nnight|53.40503|-2.98552||Futurist\nnight|53.40556|-2.98419||Carnarvon Castle\nshop|53.40567|-2.98419||Lily Bizaar\nshop|53.40492|-2.98394||Lush\nshop|53.40641|-2.98432||British Heart Foundation\nshop|53.40491|-2.98481||Decathlon\ntake|53.40515|-2.98609|th|McDonald\u0027s\nshop|53.40512|-2.98774||Menkind\ncafe|53.40512|-2.98790||Costa\nconv|53.40407|-2.99171||Tesco Express\nnight|53.40170|-2.98032||Santa Chupitos\nnight|53.39860|-2.98673||Baltic Fleet\ntake|53.39602|-2.98390|t|KFC\nculture|53.42003|-2.99685||Drop The Dumbulls\nculture|53.40299|-2.96917||Everyman Theatre\nshop|53.39567|-2.97676||The Wedding House\nnight|53.39738|-2.98193||24 Kitchen Street\ncafe|53.39964|-2.98505||Sugar And Dice\nnight|53.40204|-2.98472||The Bridewell\nrest|53.39316|-2.97794||Baltic Market\nnight|53.40181|-2.97390||Metrocola\nculture|53.40103|-2.97196||The Unity Theatre\nnight|53.40278|-2.97571||Danny Mac\u0027s Tavern\nculture|53.40111|-2.97509||static\nnight|53.40041|-2.97474||The Grapes\nnight|53.40084|-2.97576||Black Horse and Rainbow\nlib|53.39502|-2.97150||Toxteth Library\ngym|53.39234|-2.96667||Toxteth FireFit Hub\nnight|53.42472|-2.99900||The Bramley Social\nconv|53.41742|-2.99677||Spar\nnight|53.40947|-2.97744||Sketch\nnight|53.40982|-2.99371||Cross Keys\nnight|53.40778|-2.98981||Thomas Rigby\u0027s\nnight|53.41042|-2.98906||Shenanigans\nnight|53.40766|-2.99000||Saddle Inn\nnight|53.41026|-2.98925||Kitty\u0027s Showbar\nnight|53.40795|-2.99013||Lady of Mann\nnight|53.40857|-2.98770||Vernon Arms\nconv|53.40919|-2.93986||Shell Select\nnight|53.40634|-2.95723||The Bears Paw\nrest|53.39952|-2.97717|a|Ma Bo Chinese Resaurant\nrest|53.39944|-2.97727|a|Man Tsuen Ho\u0027s Restaurant\nshop|53.40713|-2.95536||B E C\nrest|53.40168|-2.98262|v|Down The Hatch\nnight|53.40359|-2.97980||Cheers Big Ears\nrest|53.40407|-2.98159||Villa Romana\nnight|53.40257|-2.97995||The Hatch\ncafe|53.40371|-2.98427||Bean\nrest|53.40299|-2.97854||Etci Mehmet\nrest|53.40288|-2.97831||Fat Hippo\nrest|53.40243|-2.97736||Honest Burgers\nrest|53.40199|-2.98339|a|Mayflower\nrest|53.40376|-2.98016|s|Akasya\nshop|53.40268|-2.97789||Grin\nnight|53.40349|-2.97848||Newington Temple\ncafe|53.40264|-2.97780||Maggie May\u0027s\nrest|53.40295|-2.97756|v|Leaf on Bold Street\nnight|53.40303|-2.97861||Ropes \u0026 Twines\nshop|53.40368|-2.98000||Moss Bros\nshop|53.40385|-2.98035||Home Bargains\nshop|53.40308|-2.97783||Route One\nrest|53.40256|-2.97763||Fogo Brazil\nshop|53.40272|-2.97797||Utility\nrest|53.40291|-2.97838||Greek Taverna\nshop|53.40283|-2.97822||Soho\u0027s\nrest|53.40308|-2.97873||Red Dog Saloon\nnight|53.40251|-2.98000||Slaters Bar\nrest|53.40281|-2.97812||Aquapod\ntake|53.40364|-2.97992|at|Mo\u0027s Noodles\ntake|53.40432|-2.98133|t|Taco Bell\ncafe|53.40295|-2.97849|v|OrgÃ¢nico\nrest|53.40277|-2.97803|s|Baron 84\nshop|53.40260|-2.97771||Forbidden Planet\nrest|53.40194|-2.98365||Duke Street Food \u0026 Drink Market\nnight|53.40432|-2.98163||The Empire\nnight|53.40126|-2.98066||The Monro\nnight|53.40306|-2.98067||Einstein\nnight|53.40325|-2.98098||Level\nnight|53.40223|-2.98277||PINS\nshop|53.42193|-2.95920||Home Bargains\nsuper|53.42211|-2.95743||Asda\ngym|53.42395|-2.99577||Awesome Walls Liverpool\nnight|53.41535|-2.98960||The Eagle\nconv|53.40498|-2.98111||California Convenience Store\nnight|53.40522|-2.98030||The Globe\nnight|53.40529|-2.97977||The Irish House\ntake|53.40508|-2.98065|t|Lobster Pot\nnight|53.40530|-2.98043||Coopers\nnight|53.40525|-2.97989||Lanigans\nnight|53.40505|-2.98076||Ranelagh\u0027s Tavern\nnight|53.40518|-2.97998||The Central\ntake|53.40520|-2.98024|t|Ohannes\nnight|53.40515|-2.98018||Midland Hotel\ntake|53.40372|-2.98599|t|Krispy Kreme\nconv|53.40942|-2.99412||Sainsbury\u0027s Local\nnight|53.40224|-2.97417||Roscoe Head\nnight|53.40221|-2.96968||The Casa Bar\nshop|53.40911|-2.97775||Empire Furniture Centre\ntake|53.40886|-2.97237|t|Subway\nrest|53.40880|-2.97229|a|Happy Brother Canteen\ncafe|53.40882|-2.97200||BÃªkas CafÃª\nconv|53.40911|-2.97577||Best-one\nrest|53.40914|-2.97678|s|Lazeez Kurdish Charcoal Grill Restaurant\nshop|53.40912|-2.97793||Henry Bohn Books\ncafe|53.42045|-2.96902||May Duncans\nnight|53.42018|-2.98929||The Castle\nculture|53.40402|-2.95857||Williamson Tunnels Heritage Centre\nrest|53.40420|-2.98841||The Botanist\nnight|53.40390|-2.98857||Fight Club\nnight|53.40969|-2.98457||Ship \u0026 Mitre\nnight|53.41154|-2.98845||Vauxhall Vaults\nnight|53.39892|-2.94456||The Earl Marshall\nconv|53.40451|-2.97947||M2Go\ntake|53.42355|-2.98156|t|McDonald\u0027s\nsuper|53.41002|-2.92603||M\u0026S Foodhall\ncafe|53.42459|-2.97907||Costa\nsuper|53.42302|-2.97970||Sainsbury\u0027s\ngym|53.42350|-2.97798||The Gym\nshop|53.42242|-2.97750||Home Bargains\ntake|53.42426|-2.98176|t|KFC\nshop|53.42458|-2.97919||Claire House Children\u0027s Hospice\nshop|53.42458|-2.97931||Barnardo\u0027s\ntake|53.42458|-2.97941|t|Greggs\nshop|53.42457|-2.97962||ExtraCare\ntake|53.42456|-2.97980|t|The Good Catch\nshop|53.42455|-2.97990||Sunseekers Tanning Centre\ntake|53.42455|-2.97999|t|Domino\u0027s\ntake|53.42454|-2.98018|t|Subway\nshop|53.42196|-2.97743||B\u0026M Bargains\nnight|53.40891|-2.98708||Rose \u0026 Crown\nnight|53.40950|-2.98500||The Excelsior\nrest|53.40893|-2.99401||Trattoria 51\nnight|53.42518|-2.97036||The Mere Bank\ncafe|53.41790|-2.93357||Newsham Park Pavilion\nconv|53.42126|-2.98120||Spar\nnight|53.40233|-2.97948||The Zanzibar Club\nnight|53.40135|-2.97805||Arts Club\nrest|53.40226|-2.98016||Wreck Bistro\nnight|53.40202|-2.98056||The Merchant\nnight|53.40206|-2.98041||The Red Lion\nnight|53.40241|-2.98295||Pattersons\nconv|53.40245|-2.98422||Duke Street Mini Mart\nconv|53.40576|-2.95582||Go Local\nrest|53.40560|-2.95555||\ngym|53.39357|-2.95109||Tiber Football Centre\nsuper|53.40543|-2.95539||\nnight|53.40551|-2.95465||The Weighing Machine\ntake|53.39966|-2.98975|t|School Bus Diner\ntake|53.39967|-2.98997|t|\nconv|53.41145|-2.97071||Shop\u0027N Drive\ngym|53.42560|-2.97205||Peak Performance Liverpool\nshop|53.40359|-2.98622||Liverpool One\nshop|53.40549|-2.98726||Diamond Heaven\nnight|53.40587|-2.98604||The Welkin\ntake|53.40516|-2.98709|t|Dave\u0027s Hot Chicken\ntake|53.40513|-2.98734|at|Chopstix\nshop|53.40514|-2.98724||CeX\nshop|53.40324|-2.98362||Home Bargains\nsuper|53.40333|-2.98300||Tesco\nrest|53.40794|-2.98543|a|Zenn Liverpool\nnight|53.40878|-2.98691||The Angus Tap \u0026 Grind\ntake|53.40590|-2.98585|t|Jollibee\ntake|53.40562|-2.98625|t|Burger King\nnight|53.40629|-2.98690||Flanagan\u0027s Apple\nshop|53.40697|-2.98166||JD Sports\nshop|53.40691|-2.98199||OneBeyond\nshop|53.40405|-2.97977||SÃ¸strene Grene\nshop|53.40372|-2.98008||Bold Street Mobile\ncafe|53.40400|-2.97967|a|Gong cha\nshop|53.40397|-2.97959||COW\nnight|53.40651|-2.98693||Remeniss\ntake|53.40664|-2.98706|st|Kebab House\nnight|53.40649|-2.98705||The Grapes\nculture|53.40652|-2.98720||Liverpool Beatles Museum\nnight|53.40674|-2.98722||The Doubliner\nnight|53.40628|-2.98663||Hardy\u0027s\nnight|53.40629|-2.98653||O\u0027Briens\nnight|53.40629|-2.98637||Legends\nnight|53.40620|-2.98633||White Star\nrest|53.40608|-2.98635||Bistro Pierre\nshop|53.40603|-2.98660||Magic Willow\ntake|53.40666|-2.98468|t|Subway\nshop|53.40459|-2.98636||JD Sports\ntake|53.40540|-2.97910|th|McDonald\u0027s\nshop|53.40596|-2.97901||Worlds Apart\nnight|53.40607|-2.97972||The Richard John Blackler\nnight|53.40592|-2.97956||Ruby Blues\nnight|53.40584|-2.97948||Smokies\nnight|53.40577|-2.97940||Tess Riley\u0027s\nnight|53.40570|-2.97932||The Rocking Horse\nnight|53.40558|-2.97920||Nelly Foley\u0027s\nsuper|53.41275|-2.93687||L7 Village Market\nshop|53.40421|-2.98637||Uniqlo\nshop|53.40538|-2.98108||B\u0026M\nrest|53.40591|-2.98023|a|Bon\nculture|53.40453|-2.98698||Odeon\ncafe|53.40393|-2.98458||CaffÃ¨ Nero\nshop|53.40399|-2.98456||size?\nshop|53.40410|-2.98453||The White Company\nshop|53.40415|-2.98452||Clarendon Fine Art\nshop|53.40421|-2.98450||Jo Malone\nshop|53.40444|-2.98503||Reiss\nshop|53.40435|-2.98506||White Stuff\nshop|53.40427|-2.98499||Swarovski\nshop|53.40425|-2.98510||Sweaty Betty\nshop|53.40417|-2.98512||Space NK\nshop|53.40405|-2.98515||Mint Velvet\nshop|53.40398|-2.98507||Rox\nshop|53.40447|-2.98439||Bravissimo\nculture|53.39674|-2.98358||The Lantern Theatre\nrest|53.39660|-2.98391||Blundell Street\nnight|53.40638|-2.98612||Kabamnas Bar\nshop|53.40619|-2.98569||Wongs Jewellers\ntake|53.40729|-2.98465|st|German Doner Kebab\nnight|53.40719|-2.98724||Molly Malones\nrest|53.40676|-2.98871|s|Shiraz\nrest|53.40694|-2.98886||Six by Nico\ncafe|53.40828|-2.98477||Kaspa\u0027s\nnight|53.40802|-2.98984||GBar\nnight|53.40888|-2.99052||The Railway\nnight|53.42223|-2.96004||The Royal\nsuper|53.40606|-2.97832||Lidl\nnight|53.40575|-2.97817||The Vines\nnight|53.40644|-2.97866||Lime Street Bar\nrest|53.40631|-2.97855||Neapolitan\nnight|53.40669|-2.97894||Crown Hotel\nnight|53.40588|-2.97893||McHales Irish American\nconv|53.40583|-2.97888||LS News \u0026 Vapes\nnight|53.40565|-2.97869||Sanctuary Craft Bar\nnight|53.40552|-2.97867||The Celtic Corner\nrest|53.40543|-2.97885||Shiraz Palace\nrest|53.40527|-2.97953||Bella Italia\nnight|53.40540|-2.97967||The Blob Shop\nnight|53.40452|-2.98296||Old Post Office\nnight|53.40450|-2.98280||Brass Monkey\nnight|53.40449|-2.98269||Present Company\nnight|53.40646|-2.98771||Eric\u0027s\nnight|53.40620|-2.98802||SGT Peppers\nrest|53.40584|-2.99136||The Alchemist\nnight|53.40562|-2.99114||The Slaughter House\nnight|53.40559|-2.99067||Liverpool Gin Distillery\nconv|53.40583|-2.99090||Sainsbury\u0027s Local\nrest|53.40593|-2.99088||Heritage\ncafe|53.40598|-2.99093||CaffÃ¨ Nero\nnight|53.40574|-2.99075||Bobo\u0027s\nnight|53.40567|-2.99078||The Underground Gin Society\nnight|53.40494|-2.99094||All Bar One\nnight|53.40466|-2.99130||The Captain Alexander\nconv|53.41140|-2.96848||Emilia\u0027s\nnight|53.40623|-2.98886||Be At One Cocktail Bar\nrest|53.40622|-2.98905|v|Veggie Republic\nnight|53.40595|-2.98912||The Crocodile\nnight|53.40597|-2.98897||The Baby Croc\nnight|53.40586|-2.98937||Abbey Road\nnight|53.40588|-2.98878||Scruffy Murphy\u0027s\nrest|53.40619|-2.98921||Piccolino\nnight|53.40652|-2.98921||Slug and Lettuce\nrest|53.40668|-2.99180|s|Mowgli Street Food\nrest|53.40615|-2.99117||Elgato Negro\u0027s Tapas\nrest|53.40675|-2.99158||So Salsa\nnight|53.40669|-2.99153||Black Barrel\ncafe|53.40658|-2.99139||Pasta Cosa\nnight|53.40661|-2.99142||McGuffie \u0026 Co\nnight|53.40653|-2.99135||The Cactus Bar\nnight|53.40650|-2.99133||MITO\nnight|53.40753|-2.98559||Victoria Cross\nnight|53.40658|-2.98668||McCooley\u0027s\nrest|53.40675|-2.98665||Casa Italia\ntake|53.40678|-2.98690|t|Hot Spot\nnight|53.40652|-2.98634||Temple Tavern\nnight|53.40670|-2.98682||Our Bar\nrest|53.40707|-2.98773||Dash\ncafe|53.40984|-2.93191||Costa\ncafe|53.40984|-2.92861||Starbucks\nsuper|53.40977|-2.92936||Lidl\ntake|53.40784|-2.97865|t|Upper Crust\ncafe|53.40824|-2.97846||Starbucks\nsuper|53.40789|-2.97832||M\u0026S Simply Food\ncafe|53.40803|-2.97826||Costa\ntake|53.40782|-2.97835|t|Krispy Kreme\nsuper|53.42545|-2.97978||Lidl\ncafe|53.42586|-2.98104||Tim Hortons\nnight|53.40248|-2.98011||The Highball Club\nnight|53.40243|-2.97997||Butter\nnight|53.40234|-2.97968||Fitzgeralds\nnight|53.40243|-2.97958||Jacaranda\nnight|53.40233|-2.97898||MOLOKO\nnight|53.40219|-2.97917||The Peacock\nnight|53.40215|-2.98044||Spanish Caravan\nnight|53.40337|-2.98052||DeLuca\u0027s\nnight|53.40348|-2.98036||Soho\nnight|53.40287|-2.98019||The Lime Kiln\nsuper|53.40657|-2.98011||Aldi\nshop|53.40704|-2.98064||Home Bargains\nshop|53.40683|-2.98071||Storm\nnight|53.40740|-2.98061||Boom Battle Bar\nshop|53.40720|-2.98107||F\u0026G\nrest|53.40785|-2.98310||ASK Italian\nrest|53.40310|-2.98569||Gordon Ramsay Bread Street Kitchen \u0026 Bar\nrest|53.40324|-2.98569||Browns\nrest|53.40333|-2.98562||The Real Greek\nshop|53.40337|-2.98545||Fred Perry\nshop|53.40341|-2.98535||Vincentius\nrest|53.40346|-2.98523||Cosmo\nshop|53.40351|-2.98508||Utility\nrest|53.40291|-2.98576|v|CÃ´te Brasserie\nrest|53.40273|-2.98513||Albert\u0027s Schenke\nrest|53.40284|-2.98484|v|Hanover Street Social\nrest|53.40315|-2.98506|a|Maggie Fu\nrest|53.40332|-2.98450||Bem Brasil\nnight|53.40326|-2.98467||leveltap\ntake|53.40187|-2.98286|t|Loxbys\ntake|53.40183|-2.98267|t|Friesday\nshop|53.40677|-2.98535||Tribal Society\ncafe|53.40691|-2.98551||Dantonio\nshop|53.40682|-2.98540||The Art Quarter\nshop|53.40550|-2.98844||Boodles\ntake|53.40545|-2.98854|t|Yanni\u0027s\nshop|53.40544|-2.98864||L1 Nails\ntake|53.40538|-2.98965|t|Pret A Manger\nrest|53.40554|-2.99003||Ezra \u0026 Gil\nshop|53.40545|-2.98945||Pavers of York\nconv|53.40546|-2.98914||Tesco Express\nshop|53.40563|-2.98701||H\u0026M\nshop|53.40468|-2.98205||Pauline Books \u0026 Media\ntake|53.40562|-2.98747|t|Popeyes\ntake|53.40553|-2.98778|t|Dunkin\u0027\nshop|53.40553|-2.98768||Gold Centre\nshop|53.40548|-2.98786||Ministry Of Wizards\nshop|53.40556|-2.98805||House Of Gifts\ntake|53.40564|-2.98807|t|Greggs\ntake|53.40571|-2.98808|t|Subway\nshop|53.40508|-2.98199||Miltons\nshop|53.40507|-2.98192||iMobile\ntake|53.40506|-2.98185|st|Damaskano\ntake|53.40505|-2.98179|at|KOKORO\nshop|53.40476|-2.98245||Cotswold Outdoor\nshop|53.40486|-2.98259||Three.\nshop|53.40481|-2.98231||Heavenly Gifts\ncafe|53.40479|-2.98220||Spice Market\nshop|53.40510|-2.98444||L\u0027Occitane\nshop|53.40468|-2.98460||Kiehl\u0027s\nshop|53.40478|-2.98456||Penhaligon\u0027s\nshop|53.40489|-2.98453||Molton Brown\nshop|53.40622|-2.98503||Lambretta\ntake|53.40596|-2.98524|t|Lobster Pot\nshop|53.40603|-2.98493||Ruby Nails\nshop|53.40608|-2.98486||Solarsun\nshop|53.40657|-2.98401||A \u0026 M Diggle\ncafe|53.40664|-2.98386||Shium Cafe\nnight|53.40668|-2.98384||Shiraz\nnight|53.40675|-2.98382||The Shakespeare\nshop|53.40666|-2.98581||Say It With Diamonds\nshop|53.40673|-2.98597||Carvela\nshop|53.40678|-2.98602||Urban Calm\nshop|53.41069|-2.97154||Glasslines\ngym|53.41081|-2.97092||Power \u0026 Fitness\nconv|53.40948|-2.97704||Go Local\ncafe|53.40949|-2.97710||The Mersey Lounge\nconv|53.40913|-2.97658||International Food Store\nshop|53.40918|-2.97628||Trutex\ntake|53.40917|-2.97611|st|Shawarma\ntake|53.40917|-2.97602|st|Abo Hassan Grill\nconv|53.40947|-2.97620||Marmaris Food store\ntake|53.40942|-2.97590|t|Freddy\u0027s\ncafe|53.40947|-2.97580||Infinity Shisha \u0026 BBQ Lounge\nshop|53.40472|-2.98746||Build-A-Bear Workshop\nshop|53.40471|-2.98733||The Entertainer\ncafe|53.40457|-2.98726|a|Mooboo\nnight|53.40317|-2.97907||Aura\ntake|53.40325|-2.97890|at|Wok \u0026 Go\ntake|53.40328|-2.97898|t|Johnny English\nshop|53.40327|-2.97913||Bold Street Cosmetics \u0026 Slimming\nnight|53.40278|-2.97876||Woody\u0027s Sports \u0026 Karaoke Bar\ntake|53.40270|-2.97923|t|Cuoco Pizza\nshop|53.40287|-2.97900||Outsiders Store\nshop|53.40279|-2.97910||KershKicks\nrest|53.40275|-2.97916||Kaibaibo\nnight|53.40302|-2.97929||Teddy\u0027s\nnight|53.40782|-2.98674||The Poste House\nshop|53.40778|-2.98641||Copplestones Bridal\nnight|53.40179|-2.97899||St Peters Tavern\nnight|53.40172|-2.97870||BrooklynMixer\nnight|53.40162|-2.97850||EBGBS\nnight|53.40158|-2.97838||Heebie Jeebies\nnight|53.40153|-2.97827||Stereo\nnight|53.40127|-2.97784||Royal Institution\nnight|53.40200|-2.97836||Dirty O\u0027Sheas\nnight|53.40239|-2.97798||Swan Inn\nnight|53.40256|-2.97856||Revolution\nnight|53.40239|-2.97816||Ink Bar\nnight|53.40126|-2.97664||Pogue Mahone\nnight|53.40120|-2.97651||Salt Dog Slim\u0027s\nnight|53.40775|-2.99010||Ye Hole In Ye Wall\nnight|53.40792|-2.99031||The Denbigh Castle\ntake|53.40786|-2.99024|t|Castro\u0027s Cafeteria\ntake|53.40784|-2.98962|st|Lemon \u0026 Lime\nconv|53.40785|-2.98941||Your Local\nnight|53.40799|-2.98943||Haus\nnight|53.40826|-2.98975||Elysium\nnight|53.40856|-2.99301||Puffin\u0027 Rooms\nnight|53.40703|-2.98814||Mansion\nrest|53.40690|-2.98807||Capeesh\nnight|53.40683|-2.98847||Club Mambo\nnight|53.40870|-2.97087||The Bullring Bar\ncafe|53.40868|-2.97064||Cafe Marmalade\ncafe|53.40950|-2.97409||Cu Cafe\nconv|53.40956|-2.97396||Tesco Express\nshop|53.40953|-2.97365||Charmwood Furniture\nconv|53.40956|-2.97341||Aram Supermarket\nshop|53.41169|-2.94437||St Joseph\u0027s Hospice Home \u0026 Furnature\nconv|53.41910|-2.98435||Best-one\ngym|53.43013|-2.97830||Powerleague\nconv|53.40863|-2.95889||Hall Lane News\ntake|53.40602|-2.94811|t|Salt \u0026 Vinegar\nrest|53.40587|-2.94810|s|Grill \u0026 Sweet\nshop|53.41194|-2.94649||\nrest|53.41166|-2.95751|a|\nculture|53.41550|-2.95733||Eventim Olympia\nnight|53.40430|-2.97712||The Blarney Stone\nconv|53.40437|-2.97722||Store\nrest|53.40470|-2.97752|a|Chy\nnight|53.40477|-2.97727||Brownlows Inn\nnight|53.40473|-2.97712||The Beehive\nnight|53.40469|-2.97703||Riley\u0027s\nrest|53.40464|-2.97689||Smoky Grill\ntake|53.40930|-2.94837|st|Omdur Cafe \u0026 Takeaway\ntake|53.40959|-2.94828|t|Tony\u0027s Fish \u0026 Chips\nconv|53.40954|-2.94828||Go Local\nnight|53.41030|-2.95013||The Liver Vaults\ntake|53.40443|-2.94795|t|Bro\u0027s Pizza\nnight|53.40423|-2.98192||O\u0027Neill\u0027s\nnight|53.40417|-2.98182||Popworld\nnight|53.40398|-2.98176||Motel\nnight|53.40379|-2.98119||ELECTRIK WAREHOUSE\nrest|53.40178|-2.97771||La Finca Eivissa\nnight|53.40157|-2.97752||LA\u0027GO\nnight|53.40165|-2.97765||Mean-Eyed Cat Bar\nconv|53.40163|-2.97746||Amsterdam Convenience Store\nnight|53.39714|-2.94948||The Masonic Arms\nrest|53.40283|-2.97572|s|Indian Delight\nshop|53.40288|-2.97576||81 Renshaw\nrest|53.40292|-2.97579||Damas\nnight|53.40296|-2.97583||Outpost\nrest|53.40306|-2.97591|a|Hee Kee\nrest|53.40318|-2.97606|s|UnI\nrest|53.40320|-2.97609|a|Derek\u0027s Noodle Bar\nrest|53.40334|-2.97629|a|Miss Phá»\nrest|53.40220|-2.97599||Rudy\u0027s\nrest|53.40225|-2.97528||Zorba\u0027s\nshop|53.40226|-2.97519||Mobile Phone Clinic\ntake|53.40227|-2.97510|st|Gourmet Grill\nnight|53.40539|-2.99145||The Cornmarket\ntake|53.40551|-2.99145|t|Greta\u0027s\nrest|53.40546|-2.99138|a|Chop Chop\nnight|53.40216|-2.96983||Jenever\nconv|53.40983|-2.96946|a|SIDA - Chinese Supermarket\ntake|53.41003|-2.97014|t|Tops Pizza\ntake|53.41008|-2.96989|t|Individual Hotpot Malatang\nconv|53.40997|-2.97055||Taza Supermarket\ncafe|53.41005|-2.97004|a|SanSan Bubble Tea\ntake|53.42237|-2.95982|st|Foodland\nshop|53.42246|-2.95970||St. Joseph\u0027s Hospice\nnight|53.42367|-2.95753||The Lutine Bell\nconv|53.42328|-2.95862||Sayers\nconv|53.42267|-2.96031||Elif Mini Market \u0026 Butchers\nshop|53.42353|-2.95792||Breck Mobiles\nshop|53.42359|-2.95781||Cara Kids\nconv|53.41140|-2.99866||Pastille Bakery\ngym|53.41157|-2.99865||Crew42\ntake|53.39480|-2.98028|t|Jamaica Street Snack Shop\nrest|53.40904|-2.94798|s|Turkish Shawarma\ncafe|53.40981|-2.94769||The Croissant of Inequality\ntake|53.40993|-2.94768|t|Holt Road Sandwich Shop\nconv|53.40996|-2.94763||Kensington Bread Company\nconv|53.41019|-2.94756||Blue Nile Grocery Store\nrest|53.41040|-2.94757||Kilos Trap Kitchen\ncafe|53.41039|-2.94739||Holt Road Cafe\ntake|53.41408|-2.95059|t|Molyneuex Supper Bar\nconv|53.41409|-2.95053||Best Butchers\nconv|53.41368|-2.95474||Best Food Mega\nrest|53.41377|-2.95481|s|House Indian Takeaway\nsuper|53.41432|-2.95073||Fresh One\ntake|53.41225|-2.94924|at|Happy Yu\nshop|53.41225|-2.94901||Top Nails\nnight|53.41582|-2.95301||The Newsham Park\nconv|53.38833|-2.96086||Mohamed General Stores\nconv|53.38935|-2.95935||Adam\u0027s News \u0026 Convenience Store\ntake|53.41603|-2.95188|t|Jimmy\u0027s\nnight|53.41610|-2.95149||Sir Walter Raleigh\ntake|53.39557|-2.95793|t|Bagels \u0026 Shakes\ntake|53.39550|-2.95778|t|Sammies Burgers \u0026 Desserts\nconv|53.39586|-2.95801||Al Rahma Food Store\nshop|53.39601|-2.95812||Oriental Fufu\ntake|53.39606|-2.95810|st|Fork\u0026Knife\nconv|53.39611|-2.95811||Nabiles\nsuper|53.39594|-2.95805||Al Baraka\nconv|53.41417|-2.95007||Molynews \u0026 Wine\nconv|53.39693|-2.95585||Kingsley News\ntake|53.39653|-2.95005|t|Go Taco\ntake|53.39650|-2.95005|t|\nsuper|53.39607|-2.94986||Spendwell Supermarket\ntake|53.39585|-2.94985|t|Star Waffle\ncafe|53.39565|-2.94976||Sakoon\nrest|53.39554|-2.94980|s|Kebabish Original\nconv|53.39544|-2.94977||Tiarey News\nnight|53.40014|-2.94902||The Nags Head\nconv|53.39295|-2.95432||\nconv|53.41226|-2.94877||Sam\u0027s Local\ntake|53.41225|-2.94854|t|UK Fried Chicken\ntake|53.41226|-2.94839|st|Caspian Fast Food\ncafe|53.41429|-2.94919||Molly Cafe\nshop|53.39468|-2.94967||Phone Lodge\nrest|53.39464|-2.94966|s|Anam\u0027s Kitchen\nshop|53.39459|-2.94964||Khalifa\nconv|53.39455|-2.94959||Lodge Lane Halal Meat \u0026 Groceries\nrest|53.39439|-2.94961||Middle Eastern\ntake|53.39428|-2.94954|st|Tureen\nconv|53.39421|-2.94953||Green Mountain Food Store\nconv|53.39785|-2.94949||Savalan Mini Market\nconv|53.39811|-2.94893||O\u0027Hare\u0027s News\nnight|53.39829|-2.94944||The Boundary\nconv|53.41646|-2.94967||Boaler Street Convenience Store\nnight|53.42291|-2.98597||The Britannia\nconv|53.41228|-2.94749||Sai Lakshmi\nconv|53.41228|-2.94725||3 Mien\nconv|53.41228|-2.94718||Pat\u0027s Mini Shop\nnight|53.42593|-2.95663||The Oakfield\nnight|53.42574|-2.95710||The King Charles\nconv|53.41229|-2.94651||\ncafe|53.41230|-2.94614||Capaldi\u0027s CafÃ©\nconv|53.41230|-2.94603||Raz Newsagents\nconv|53.41228|-2.94583||Dwa Koty\nshop|53.41241|-2.94567||Home Bargains\ntake|53.41231|-2.94545|t|Hello Pizza\nshop|53.41232|-2.94539||Tala\nconv|53.41239|-2.94505||Kensington Superstore\nnight|53.41244|-2.94460||Sheil Park\nconv|53.41254|-2.94383||Mr B\u0027s Newsagent\nshop|53.41250|-2.94405||Croft Community Shop\nshop|53.41283|-2.94220||TC Links\nconv|53.41290|-2.94191||Food Plus\ntake|53.41302|-2.94114|t|Jimmy\u0027s\nconv|53.41673|-2.94828||Go Local\nrest|53.41277|-2.94081|a|Golden Empire\ntake|53.41278|-2.94069|st|Krnsington Kebab House\nrest|53.41280|-2.94061||Green Chillies Restaurant\nshop|53.41309|-2.94078||Dress Sense Couture\ntake|53.41310|-2.94070|at|Feng Sing\nrest|53.41313|-2.94043||Rosie\u0027s\nrest|53.41316|-2.94036||Africa 9JA\nshop|53.41290|-2.94003||Kenkwo Holdings UK\nconv|53.41292|-2.93988||Betty \u0026 Tom Newsagents\ncafe|53.41296|-2.93968||Salina Cafe\nrest|53.41298|-2.93952||Sanfex African Hotspot\ncafe|53.41320|-2.93999||Corner Cafe\nshop|53.41323|-2.93993||Mobile Phone \u0026 PC House\nshop|53.41325|-2.93985||The Furnature Corner\nnight|53.39344|-2.97697||Yellow Submarine Bar\ntake|53.41692|-2.94891|at|Berwick\nrest|53.41336|-2.93715||Anar\nnight|53.41342|-2.93687||The Edinburgh\ncafe|53.41377|-2.93508||Beanstalk Coffee\nconv|53.41378|-2.93500||Murphy\u0027s Wines\nconv|53.41401|-2.93359||\ntake|53.40206|-2.96992|t|Pepe\u0027s\nnight|53.40365|-2.98102||Fusion\nnight|53.42403|-2.99999||The Bramley Moore Hotel\nsuper|53.39742|-2.97987|a|Chung Wah";

  const CAMPUSES = {
    uol: ['University of Liverpool main campus', 53.4065, -2.9663],
    'ljmu-city': ['LJMU City campus', 53.4127, -2.9838],
    'ljmu-mp': ['LJMU Mount Pleasant campus', 53.4030, -2.9725],
    'hope-park': ['Liverpool Hope University Hope Park campus', 53.3905, -2.8917],
    'hope-creative': ['Hope University Creative campus', 53.4190, -2.9688],
    lipa: ['Liverpool Institute for Performing Arts', 53.3996, -2.9700],
    unsure: ['Liverpool city centre reference point', 53.4035, -2.9868],
  };
  const QUESTIONS = [
    { id: 'campus', q: 'Which campus will you mainly study at?', hint: 'Used to estimate your commute. With the University of Liverpool you can also use the side panel "My subject" to locate the teaching building for your course.', opts: [
      ['uol', '🎓', 'University of Liverpool', 'Main city-centre campus'], ['ljmu-city', '🎓', 'Liverpool John Moores · City', 'Byrom Street'],
      ['ljmu-mp', '🎓', 'Liverpool John Moores · Mount Pleasant', 'Mount Pleasant campus'], ['hope-park', '🎓', 'Liverpool Hope University', 'Hope Park, Childwall'],
      ['hope-creative', '🎭', 'Hope University · Creative Campus', 'Everton'], ['lipa', '🎤', 'Liverpool Institute for Performing Arts', 'Mount Street'], ['unsure', '🤔', 'Not sure yet', 'Use Liverpool city centre as a reference'] ] },
    { id: 'dinner', q: 'When you are hungry at 7pm, you usually…', opts: [
      ['cook', '🍳', 'Cook for yourself', 'An easy grocery run matters'], ['out', '🍽️', 'Go out to eat with friends', 'You want to explore nearby restaurants'],
      ['takeaway', '🥡', 'Grab takeaway or order in', 'Quick and easy, fewer dishes'], ['mix', '🎲', 'Any of these, depending on mood', 'Cook, eat out and takeaway take turns'] ] },
    { id: 'shop', q: 'How do you like to stock up on food?', opts: [
      ['topup', '🧺', 'A little at a time, as you need it', 'A nearby food shop makes life easy'], ['weekly', '🛒', 'One big weekly shop', 'You want to be close to a supermarket'],
      ['special', '🌶️', 'You hunt down familiar ingredients', 'Asian or international food shops are a plus'], ['rarely', '🙃', 'You rarely buy groceries', 'You mostly eat out'] ] },
    { id: 'flavour', multi: true, max: 3, q: 'What kinds of food do you want nearby?', hint: 'Multi-select; choosing "Anything goes" clears the other picks.', opts: [
      ['east', '🍜', 'East & Southeast Asian', 'Chinese, Japanese, Korean, Thai and more'], ['south', '🍛', 'South Asian & Middle Eastern', 'Curry, kebabs, Lebanese dishes and more'],
      ['veg', '🥗', 'Plant-based', 'Places flagged in the reference data'], ['any', '😋', 'Anything goes', 'No real preference'] ] },
    { id: 'study', q: 'Where do you settle into study mode most easily?', opts: [
      ['library', '📚', 'A library', 'You like a dedicated study space'], ['cafe', '☕', 'A café', 'A laptop and a coffee'],
      ['desk', '🪑', 'Your own desk', 'You focus better at home'], ['any', '🎒', 'Anywhere works', 'You are not fussy about where you study'] ] },
    { id: 'free', multi: true, max: 2, q: 'On a free Saturday afternoon, you would rather…', hint: 'Pick up to two.', opts: [
      ['shops', '🛍️', 'Wander the shops', 'Clothes, bookshops, little finds'], ['park', '🌳', 'Walk or run in a park', 'Get some fresh air'],
      ['gym', '🏋️', 'Work out or play a sport', 'Keep the energy up'], ['culture', '🎨', 'See an exhibition, a film or a show', 'Add a little inspiration'], ['home', '🛋️', 'Stay cosy at home', 'Recharge the batteries'] ] },
    { id: 'night', q: 'How would you describe your evenings?', hint: 'This only compares how many night-time venues are listed; it does not rate street noise or safety.', opts: [
      ['calm', '🌙', 'Early to bed', 'You do not need to be near pubs and clubs'], ['some', '🎶', 'Out occasionally', 'It does not have to be busy every day'], ['lots', '🪩', 'Often out at night', 'You want plenty of night venues close by'] ] },
    { id: 'walk', q: 'How long are you happy to walk to class?', hint: 'Walk time is a distance estimate, not a live route; "within 15 minutes" will not relax automatically.', opts: [
      ['close', '🏃', 'The shorter the better', 'Short-commute homes come first'], ['mid', '🚶', 'Around 15 minutes', 'Only homes that meet this cap'],
      ['far', '🚌', 'A bit further is fine', 'Day-to-day life matters more — check transport separately'] ] },
  ];

  const CAMPUS_ZH = {
    uol:'利物浦大学主校区', 'ljmu-city':'利物浦约翰摩尔大学 City 校区',
    'ljmu-mp':'利物浦约翰摩尔大学 Mount Pleasant 校区', 'hope-park':'利物浦希望大学 Hope Park 校区',
    'hope-creative':'利物浦希望大学 Creative 校区', lipa:'利物浦表演艺术学院', unsure:'利物浦市中心参考点'
  };
  // Only display copy is translated; option IDs and the original scoring stay unchanged.
  const QUESTION_ZH = {
    campus:{q:'你主要会在哪个校区上课？',hint:'用于估算通勤。利物浦大学学生还可以通过侧边“我的专业”找到专业对应的教学楼。',opts:[
      ['利物浦大学','市中心主校区'],['利物浦约翰摩尔大学 · City','Byrom Street'],
      ['利物浦约翰摩尔大学 · Mount Pleasant','Mount Pleasant 校区'],['利物浦希望大学','Childwall 的 Hope Park 校区'],
      ['利物浦希望大学 · Creative 校区','Everton'],['利物浦表演艺术学院','Mount Street'],['还不确定','先以利物浦市中心作为参考']]},
    dinner:{q:'晚上七点饿了，你通常会……',opts:[['自己下厨','买菜方便很重要'],['和朋友出去吃','想探索附近的餐厅'],['买外卖或点餐到家','省时省心，少洗碗'],['看心情，哪种都行','做饭、外食和外卖轮着来']]},
    shop:{q:'你习惯怎样采购食材？',opts:[['需要时买一点','家附近有食品店就方便'],['每周一次大采购','希望离超市近一些'],['专门寻找熟悉的食材','亚洲或国际食品店是加分项'],['很少买菜','大多在外面吃']]},
    flavour:{q:'你希望附近有哪些口味？',hint:'可以多选；选择“都可以”会清除其他选项。',opts:[['东亚与东南亚美食','中餐、日料、韩餐、泰餐等'],['南亚与中东美食','咖喱、烤肉、黎巴嫩菜等'],['植物性饮食','按参考资料中的标记筛选'],['都可以','没有特别偏好']]},
    study:{q:'你在哪里最容易进入学习状态？',opts:[['图书馆','喜欢专门的学习空间'],['咖啡馆','一台电脑，一杯咖啡'],['自己的书桌','在家更容易专注'],['哪里都行','不太挑学习地点']]},
    free:{q:'周六下午有空，你更想……',hint:'最多选两项。',opts:[['逛逛商店','衣服、书店和小惊喜'],['在公园散步或跑步','出去呼吸新鲜空气'],['健身或运动','保持活力'],['看展、电影或演出','给生活添点灵感'],['舒服地待在家','休息一下，恢复精力']]},
    night:{q:'你的夜晚通常是什么样？',hint:'这里只比较已记录夜间场所的数量，不评价街道噪音或安全。',opts:[['早睡早起','不需要住在酒吧和夜店旁'],['偶尔出去玩','不用每天都很热闹'],['经常享受夜生活','希望附近有丰富的夜间去处']]},
    walk:{q:'你愿意步行多久去上课？',hint:'步行时间按距离估算，并非实时路线；选择“15 分钟以内”后不会自动放宽条件。',opts:[['越近越好','优先考虑通勤短的公寓'],['15 分钟左右','只保留符合这个上限的公寓'],['远一点也可以','更看重日常生活便利，交通需另行确认']]}
  };
  function displayQuestion(question) {
    if (!isChinese()) return question;
    const copy = QUESTION_ZH[question.id];
    return {...question, q:copy.q, hint:copy.hint, opts:question.opts.map(([id,emoji],index)=>[id,emoji,...copy.opts[index]])};
  }

  const wrap = document.getElementById('hmWrap'), body = document.getElementById('hmBody');
  const panel = document.getElementById('hmRes'), panelBody = document.getElementById('hmResBody');
  if (!wrap || !body || !panel || !panelBody) return;
  const miniButton = document.getElementById('hmMini');
  // Home Match reuses the Life Quiz overlay and card components (lc-wrap / lc-mc / lc-panel).
  const card = document.getElementById('hm');
  wrap.classList.add('lc-wrap','lc-root','hm-lc-wrap');
  card?.classList.add('lc-mc','hm-lc');
  if (card && !card.querySelector('.lc-tape')) card.insertAdjacentHTML('afterbegin','<span class="lc-tape" aria-hidden="true"></span>');
  panel.classList.add('lc-panel','lc-root','hm-lc-panel');
  const SQUIGGLE = '<svg class="lc-squiggle" viewBox="0 0 220 14" aria-hidden="true"><path d="M3 9c18-8 30 6 48-1s28-7 46 0 30 6 48-1 30-6 46 1 20 4 26 0" fill="none" stroke="#b5462f" stroke-width="3" stroke-linecap="round"/></svg>';
  let advanceTimer = 0;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const storeKey = 'lsm-home-match-answers-v1';
  const embeddedLifeMap = new URL(location.href).searchParams.get('lifeMap') === '1';
  const state = { answers: {}, step: -1, active: false, result: null, selected: 0, returnFocus: null, homesHidden: false };
  const cleanAnswers = input => {
    const out = {};
    if (!input || typeof input !== 'object' || Array.isArray(input)) return out;
    QUESTIONS.forEach(q => {
      const allowed = new Set(q.opts.map(o => o[0])), value = input[q.id];
      if (q.multi && Array.isArray(value)) {
        const selected = [...new Set(value.filter(v => typeof v === 'string' && allowed.has(v)))].slice(0, q.max);
        if (selected.length) out[q.id] = selected.includes('any') ? ['any'] : selected;
      } else if (!q.multi && typeof value === 'string' && allowed.has(value)) out[q.id] = value;
    });
    return out;
  };
  // External test handoffs must be complete and exact. Stored drafts can be
  // repaired by cleanAnswers; a malformed URL must never silently become a
  // different set of recommendations.
  function linkedAnswers(value) {
    if (typeof value !== 'string' || !value.length || value.length > 1200) return null;
    try {
      const input = JSON.parse(value);
      if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
      const keys = Object.keys(input), known = new Set(QUESTIONS.map(q => q.id));
      if (keys.length !== QUESTIONS.length || keys.some(key => !known.has(key))) return null;
      const clean = cleanAnswers(input);
      if (!QUESTIONS.every(q => {
        const before = input[q.id], after = clean[q.id];
        return q.multi
          ? Array.isArray(before) && Array.isArray(after) && before.length === after.length && before.every((choice, index) => choice === after[index])
          : typeof before === 'string' && before === after;
      })) return null;
      return clean;
    } catch (_) { return null; }
  }
  try { state.answers = cleanAnswers(JSON.parse(localStorage.getItem(storeKey) || localStorage.getItem('lhm-ans') || 'null')); } catch (_) {}
  const answered = q => q.multi ? Array.isArray(state.answers[q.id]) && state.answers[q.id].length > 0 : !!state.answers[q.id];
  const complete = () => QUESTIONS.every(answered);
  let toastTimer = 0, inertNodes = [], nativeSession = null;
  function toast(message) {
    const node = document.getElementById('hmToast');
    node.textContent = message; node.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { node.hidden = true; }, 4200);
  }
  function saveAnswers() {
    try { localStorage.setItem(storeKey, JSON.stringify(state.answers)); }
    catch (_) { toast(local('This browser cannot store your answers right now; you can still keep going.','当前浏览器暂时无法保存答案，但你仍然可以继续。')); }
  }

  // Deduplicate imported records before counting. Names remain in their original local form.
  const seenPlaces = new Set();
  const places = POI_RAW.split('\n').flatMap(line => {
    const [type, latitude, longitude, flags = '', name = ''] = line.split('|');
    const lat = Number(latitude), lng = Number(longitude);
    if (!type || !Number.isFinite(lat) || !Number.isFinite(lng)) return [];
    const key = `${type}|${lat}|${lng}|${name}`;
    if (seenPlaces.has(key)) return [];
    seenPlaces.add(key);
    return [{ c: type, r: raw(lat, lng), f: flags, n: name.replace(/CafÃ©/g, 'Café').replace(/CaffÃ¨/g, 'Caffè').replace(/RÃ¶/g, 'Rö').replace(/Â°/g, '°').replace(/â/g, '’').replace(/â/g, '—') }];
  });
  const intlPattern = /international|world|halal|polish|euro|asian|oriental|african|caribbean|turkish|arab|persian|kurd|lebanese|indian|chinese|korean|japanese|thai|seoul|wing yip|chung wah|sida/i;
  const parkPoints = [];
  GEO.parks.forEach(path => parseD(path).forEach(ring => ring.pts.forEach(point => parkPoints.push(point))));
  const walking = (a, b) => Math.max(1, walkMin(a, b));
  HOMES.forEach(home => {
    const point = raw(home.lat, home.lng), near = {}, counts = {};
    const nearest = (key, place, minutes) => {
      if (!near[key] || minutes < near[key].m || (minutes === near[key].m && !near[key].p.n && place.n)) near[key] = {m:minutes, p:place};
    };
    const count = (key, minutes, limit) => { if (minutes <= limit) counts[key] = (counts[key] || 0) + 1; };
    places.forEach(place => {
      const minutes = walking(point, place.r), grocery = ['super','conv'].includes(place.c), eatery = ['rest','take','cafe'].includes(place.c);
      if (place.c === 'super') { nearest('super', place, minutes); count('super10', minutes, 10); }
      if (grocery) nearest('topup', place, minutes);
      if (grocery && (place.f.includes('a') || place.f.includes('s') || intlPattern.test(place.n))) nearest('intl', place, minutes);
      if (grocery && place.f.includes('a')) nearest('asianGroc', place, minutes);
      if (place.c === 'rest') count('rest10', minutes, 10);
      if (place.c === 'cafe') { count('cafe10', minutes, 10); nearest('cafe', place, minutes); }
      if (place.c === 'take') count('take10', minutes, 10);
      if (eatery && place.f.includes('a')) count('asian10', minutes, 10);
      if (eatery && place.f.includes('s')) count('sa10', minutes, 10);
      if (place.f.includes('v')) count('veg10', minutes, 10);
      if (place.c === 'night') { count('night10', minutes, 10); count('night3', minutes, 3); }
      if (place.c === 'shop') count('shop10', minutes, 10);
      if (place.c === 'culture') count('culture15', minutes, 15);
      if (place.c === 'gym') nearest('gym', place, minutes);
      if (place.c === 'lib') nearest('lib', place, minutes);
    });
    let closestPark = null, parkDistance = Infinity;
    parkPoints.forEach(p => {
      const distance = Math.hypot(p[0] - point[0], p[1] - point[1]);
      if (distance < parkDistance) { parkDistance = distance; closestPark = p; }
    });
    if (closestPark) near.park = {m:walking(point, closestPark), p:{r:closestPark, n:'Green-space boundary reference point'}};
    home.hm = {near, cnt:counts, r:point};
  });

  const countOf = (home, key) => home.hm.cnt[key] || 0;
  const PLACE_ZH = {super:'超市',topup:'食品店',intl:'国际食品店',asianGroc:'亚洲食品店',cafe:'咖啡馆',lib:'图书馆',park:'绿地',gym:'健身房'};
  const placeName = (place, fallback) => place.n === 'Green-space boundary reference point' ? local(place.n,'绿地边界参考点') : (place.n || fallback);
  const nearText = (home, key, fallback) => {
    const place = home.hm.near[key], label = local(fallback,PLACE_ZH[key] || fallback);
    return place ? local(`${placeName(place.p,label)}: about ${place.m} min on foot`,`${placeName(place.p,label)}：预计步行约 ${place.m} 分钟`) : local(`No usable distance recorded for the ${fallback}`,`暂无${label}的有效距离记录`);
  };
  const usesSubject = () => state.answers.campus === 'uol' && !!subject;
  const campusName = () => usesSubject() ? local(`nearest teaching building for ${subjName(subject)}`,`${subjName(subject)}最近的教学楼`) : local((CAMPUSES[state.answers.campus] || CAMPUSES.unsure)[0],CAMPUS_ZH[state.answers.campus] || CAMPUS_ZH.unsure);
  const campusText = home => {
    const prefix = usesSubject() ? `${campusName()}${home.subjB ? `（${home.subjB}）` : ''}` : campusName();
    return local(`${prefix}: about ${home.hm.campus} min on foot${home.hm.campus > 30 ? ', consider public transport' : ''}`,`${prefix}：预计步行约 ${home.hm.campus} 分钟${home.hm.campus > 30 ? '，建议另查公共交通' : ''}`);
  };
  const metrics = {
    super: {dir:-1, value:h=>h.hm.near.super?.m ?? 999, spot:'super', ico:'🛒', good:h=>nearText(h,'super','supermarket'), bad:h=>nearText(h,'super','supermarket')},
    super10: {dir:1, value:h=>countOf(h,'super10')},
    topup: {dir:-1, value:h=>h.hm.near.topup?.m ?? 999, spot:'topup', ico:'🧺', good:h=>nearText(h,'topup','food shop'), bad:h=>nearText(h,'topup','food shop')},
    intl: {dir:-1, value:h=>h.hm.near.intl?.m ?? 999, spot:'intl', ico:'🌶️', good:h=>local(`International grocery reference: ${nearText(h,'intl','international food shop')}`,`国际食材购物参考：${nearText(h,'intl','international food shop')}`), bad:h=>nearText(h,'intl','international food shop')},
    asianGroc: {dir:-1, value:h=>h.hm.near.asianGroc?.m ?? 999, spot:'asianGroc', ico:'🥢', good:h=>local(`Asian grocery reference: ${nearText(h,'asianGroc','Asian food shop')}`,`亚洲食材购物参考：${nearText(h,'asianGroc','Asian food shop')}`), bad:h=>nearText(h,'asianGroc','Asian food shop')},
    rest10: {dir:1, value:h=>countOf(h,'rest10'), ico:'🍽️', good:h=>local(`About a 10-minute radius holds ${countOf(h,'rest10')} restaurants`,`约 10 分钟范围内记录有 ${countOf(h,'rest10')} 家餐厅`), bad:h=>local(`Fewer restaurants listed within about 10 minutes (${countOf(h,'rest10')} places)`,`约 10 分钟范围内记录的餐厅较少（${countOf(h,'rest10')} 家）`)},
    cafe10: {dir:1, value:h=>countOf(h,'cafe10'), spot:'cafe', ico:'☕', good:h=>local(`About a 10-minute radius holds ${countOf(h,'cafe10')} cafés; ${nearText(h,'cafe','café')}`,`约 10 分钟范围内记录有 ${countOf(h,'cafe10')} 家咖啡馆；${nearText(h,'cafe','café')}`), bad:h=>local(`About a 10-minute radius holds ${countOf(h,'cafe10')} cafés`,`约 10 分钟范围内记录有 ${countOf(h,'cafe10')} 家咖啡馆`)},
    take10: {dir:1, value:h=>countOf(h,'take10'), ico:'🥡', good:h=>local(`About a 10-minute radius holds ${countOf(h,'take10')} takeaway spots`,`约 10 分钟范围内记录有 ${countOf(h,'take10')} 家外卖店`), bad:h=>local(`Fewer takeaway places listed within about 10 minutes (${countOf(h,'take10')} places)`,`约 10 分钟范围内记录的外卖店较少（${countOf(h,'take10')} 家）`)},
    asian10: {dir:1, value:h=>countOf(h,'asian10'), ico:'🍜', good:h=>local(`About a 10-minute radius holds ${countOf(h,'asian10')} East and Southeast Asian places`,`约 10 分钟范围内记录有 ${countOf(h,'asian10')} 家东亚与东南亚餐饮店`), bad:h=>local(`Fewer East and Southeast Asian places nearby (${countOf(h,'asian10')} listed)`,`附近记录的东亚与东南亚餐饮店较少（${countOf(h,'asian10')} 家）`)},
    sa10: {dir:1, value:h=>countOf(h,'sa10'), ico:'🍛', good:h=>local(`About a 10-minute radius holds ${countOf(h,'sa10')} South Asian and Middle Eastern places`,`约 10 分钟范围内记录有 ${countOf(h,'sa10')} 家南亚与中东餐饮店`), bad:h=>local(`Fewer South Asian and Middle Eastern places nearby (${countOf(h,'sa10')} listed)`,`附近记录的南亚与中东餐饮店较少（${countOf(h,'sa10')} 家）`)},
    veg10: {dir:1, value:h=>countOf(h,'veg10'), ico:'🥗', good:h=>local(`About a 10-minute radius has ${countOf(h,'veg10')} plant-based listings - check menus to be sure`,`约 10 分钟范围内有 ${countOf(h,'veg10')} 处植物性饮食记录，请另行确认菜单`), bad:h=>local('Few plant-based listings nearby - ask the venues about their menus','附近植物性饮食记录较少，请向店家确认菜单')},
    lib: {dir:-1, value:h=>h.hm.near.lib?.m ?? 999, spot:'lib', ico:'📚', good:h=>nearText(h,'lib','A library'), bad:h=>nearText(h,'lib','A library')},
    nightFew: {dir:-1, value:h=>countOf(h,'night3'), ico:'🌙', good:h=>local(`About a 3-minute radius holds ${countOf(h,'night3')} night venues; this is not a noise rating`,`约 3 分钟范围内记录有 ${countOf(h,'night3')} 处夜间场所，这不是噪音评分`), bad:h=>local(`About a 3-minute radius holds ${countOf(h,'night3')} night venues — check real noise when you view`,`约 3 分钟范围内记录有 ${countOf(h,'night3')} 处夜间场所，请在看房时确认实际噪音`)},
    night10: {dir:1, value:h=>countOf(h,'night10'), ico:'🪩', good:h=>local(`About a 10-minute radius holds ${countOf(h,'night10')} pubs and night venues`,`约 10 分钟范围内记录有 ${countOf(h,'night10')} 处酒吧和夜间场所`), bad:h=>local(`Fewer night venues listed within about 10 minutes (${countOf(h,'night10')} places)`,`约 10 分钟范围内记录的夜间场所较少（${countOf(h,'night10')} 处）`)},
    shop10: {dir:1, value:h=>countOf(h,'shop10'), ico:'🛍️', good:h=>local(`About a 10-minute radius holds ${countOf(h,'shop10')} retail shops`,`约 10 分钟范围内记录有 ${countOf(h,'shop10')} 家零售商店`), bad:h=>local(`Fewer retail shops nearby (about a 10-minute radius, ${countOf(h,'shop10')} places)`,`附近记录的零售商店较少（约 10 分钟范围内 ${countOf(h,'shop10')} 家）`)},
    park: {dir:-1, value:h=>h.hm.near.park?.m ?? 999, spot:'park', ico:'🌳', good:h=>`${nearText(h,'park','green space')}${local('; check where the entrance is','；请另行确认入口位置')}`, bad:h=>`${nearText(h,'park','green space')}${local('; this is not the entrance route','；此距离并非到入口的实际路线')}`},
    gym: {dir:-1, value:h=>h.hm.near.gym?.m ?? 999, spot:'gym', ico:'🏋️', good:h=>nearText(h,'gym','gym'), bad:h=>nearText(h,'gym','gym')},
    culture15: {dir:1, value:h=>countOf(h,'culture15'), ico:'🎨', good:h=>local(`About a 15-minute radius holds ${countOf(h,'culture15')} museums, galleries or performance venues`,`约 15 分钟范围内记录有 ${countOf(h,'culture15')} 处博物馆、画廊或演出场所`), bad:h=>local(`Fewer cultural venues nearby (about a 15-minute radius, ${countOf(h,'culture15')} places)`,`附近记录的文化场所较少（约 15 分钟范围内 ${countOf(h,'culture15')} 处）`)},
    campus: {dir:-1, value:h=>h.hm.campus, ico:'🎓', good:campusText, bad:campusText},
  };
  function weightsFor(answers) {
    const weights = {}, add = (key, weight) => { weights[key] = (weights[key] || 0) + weight; };
    ({cook:()=>{add('super',2);add('super10',.5);},out:()=>{add('rest10',2);add('cafe10',.5);},takeaway:()=>{add('take10',2);add('topup',.5);},mix:()=>{add('rest10',.7);add('take10',.7);add('super',.7);}})[answers.dinner]?.();
    const flavours = answers.flavour || [];
    ({topup:()=>add('topup',1.5),weekly:()=>{add('super',1.5);add('super10',.5);},special:()=>add(flavours.includes('east') && !flavours.includes('south') ? 'asianGroc' : 'intl',2)})[answers.shop]?.();
    if (flavours.includes('east')) add('asian10',1.5);
    if (flavours.includes('south')) add('sa10',1.5);
    if (flavours.includes('veg')) add('veg10',1);
    ({library:()=>add('lib',2),cafe:()=>add('cafe10',1.8),desk:()=>add('nightFew',.6)})[answers.study]?.();
    (answers.free || []).forEach(choice=>({shops:()=>add('shop10',1.4),park:()=>add('park',1.4),gym:()=>add('gym',1.4),culture:()=>add('culture15',1.4),home:()=>add('nightFew',.3)})[choice]?.());
    ({calm:()=>add('nightFew',1.5),some:()=>add('night10',.4),lots:()=>add('night10',2)})[answers.night]?.();
    add('campus',{close:3,mid:1.6,far:.5}[answers.walk] || 1);
    return weights;
  }
  function matchHomes() {
    const campus = CAMPUSES[state.answers.campus] || CAMPUSES.unsure, campusPoint = raw(campus[1],campus[2]);
    HOMES.forEach(home => {home.hm.campus = usesSubject() && Number.isFinite(home.subj) ? Math.max(1,home.subj) : walking(home.hm.r,campusPoint);});
    const weights = weightsFor(state.answers), keys = Object.keys(weights), percentiles = {};
    keys.forEach(key => {
      const values = HOMES.map(home => metrics[key].value(home) * metrics[key].dir), ranks = new Map();
      HOMES.forEach((home,i) => {let lower=0,ties=0;values.forEach(value=>{if(value<values[i])lower++;else if(value===values[i])ties++;});ranks.set(home.id,(lower+(ties-1)/2)/Math.max(1,HOMES.length-1));});
      percentiles[key] = ranks;
    });
    const filtered = HOMES.filter(matchesHomeFilters);
    // Historical sold-out labels are not live inventory; keep them and disclose on each result.
    const pool = state.answers.walk === 'mid' ? filtered.filter(home => home.hm.campus <= 15) : filtered;
    const total = keys.reduce((sum,key)=>sum+weights[key],0);
    // "The shorter the better" promises short-commute homes first: homes within a few minutes of the
    // shortest available commute (or within 10 minutes) form the first tier; lifestyle score orders each tier.
    const shortest = pool.reduce((m,home)=>Math.min(m,home.hm.campus),Infinity), shortCap = Math.max(10, shortest + 4);
    const tier = home => state.answers.walk === 'close' && home.hm.campus > shortCap ? 1 : 0;
    const scored = pool.map(home=>({h:home,score:keys.reduce((sum,key)=>sum+weights[key]*percentiles[key].get(home.id),0)/total})).sort((a,b)=>tier(a.h)-tier(b.h) || b.score-a.score || a.h.hm.campus-b.h.hm.campus || a.h.n-b.h.n);
    const picks = [];
    // Prefer distinct blocks; when fewer than three qualify, show the actual number without widening filters.
    for (const entry of scored) {
      if (picks.length === 3) break;
      if (picks.some(p=>Math.hypot(p.h.hm.r[0]-entry.h.hm.r[0],p.h.hm.r[1]-entry.h.hm.r[1])<12)) continue;
      picks.push(entry);
    }
    // Nearby homes can still be useful alternatives if no other block qualifies.
    if (picks.length < Math.min(3,scored.length)) scored.forEach(entry=>{if(picks.length<3 && !picks.includes(entry)) picks.push(entry);});
    picks.forEach(entry => {
      const ranked = keys.filter(key=>metrics[key].good).map(key=>({key,weight:weights[key],rank:percentiles[key].get(entry.h.id)}));
      entry.good = ranked.filter(item=>item.rank>=.6).sort((a,b)=>b.weight*b.rank-a.weight*a.rank).slice(0,4);
      if (!entry.good.some(item=>item.key==='campus')) entry.good = [{key:'campus'},...entry.good].slice(0,4);
      entry.trade = ranked.filter(item=>item.rank<.35 && item.weight>=1).sort((a,b)=>b.weight-a.weight)[0] || null;
    });
    return {picks,weights,eligible:pool.length,filterCount:filtered.length};
  }
  function persona() {
    const a = state.answers, flavours = a.flavour || [];
    const modifier = flavours.includes('east') ? local('Flavour seeker','亚洲美食爱好者') : flavours.includes('south') ? local('Spice lover','香料爱好者') : flavours.includes('veg') ? local('Plant-based eater','植物性饮食爱好者') : '';
    const food = {cook:local('Home cook','居家主厨'),out:local('Restaurant hunter','餐厅探索家'),takeaway:local('Takeaway connoisseur','外卖行家'),mix:local('Easy-going foodie','随性美食家')}[a.dinner] || local('Everyday explorer','日常探索家');
    const title = {library:local('Library regular','图书馆常客'),cafe:local('Café scholar','咖啡馆学习派'),desk:local('Study-at-home type','居家学习派'),any:local('Free-roaming explorer','自由探索家')}[a.study] || local('City explorer','城市探索家');
    const bits = [{cook:local('you like cooking for yourself','喜欢自己下厨'),out:local('you like eating out','喜欢在外用餐'),takeaway:local('you lean on easy takeaway','偏爱省心的外卖'),mix:local('you are open to all kinds of dining','用餐方式随心选择')}[a.dinner],{topup:local('you shop a little at a time','习惯少量多次采购'),weekly:local('you prefer one big weekly shop','喜欢每周一次大采购'),special:local('you seek out familiar ingredients','会寻找熟悉的食材'),rarely:local('you rarely grocery shop','很少采购食材')}[a.shop],{library:local('you study best in a library','在图书馆学习更专注'),cafe:local('you like studying in cafés','喜欢在咖啡馆学习'),desk:local('you are most comfortable at your own desk','在自己的书桌前最自在'),any:local('you are not fussy about where you study','不太挑学习地点')}[a.study]].filter(Boolean);
    const activities = (a.free || []).map(key=>({shops:local('shopping','逛商店'),park:local('going to the park','去公园'),gym:local('sport','运动'),culture:local('exhibitions and shows','看展览和演出'),home:local('recharging at home','在家休息')}[key])).filter(Boolean);
    return {title:[title,modifier,food].filter(Boolean).join(' · '),stamp:{library:'📚',cafe:'☕',desk:'🪑',any:'🎒'}[a.study] || '🏠',desc:local(`${bits.join(', ')}${activities.length?`; at weekends ${activities.join(', ')}`:''}.`,`你${bits.join('，')}${activities.length?`；周末喜欢${activities.join('、')}`:''}。`)};
  }

  function setModalBackground(inert) {
    if (inert) {
      if (inertNodes.length) return;
      inertNodes = [...document.body.children].filter(node=>node!==wrap && node.id!=='hmToast' && !['SCRIPT','STYLE','LINK'].includes(node.tagName)).map(node=>[node,node.inert]);
      inertNodes.forEach(([node])=>{node.inert=true;});
    } else {inertNodes.forEach(([node,previous])=>{node.inert=previous;});inertNodes=[];}
  }
  function closeQuiz(restoreFocus=true) {
    clearTimeout(advanceTimer);
    wrap.hidden = true; setModalBackground(false);
    if (restoreFocus) {
      const target = state.returnFocus;
      if (target!==document.body && target?.isConnected && target.getClientRects().length) target.focus({preventScroll:true});
      else focusEntry();
    }
  }
  function focusEntry() {
    [...document.querySelectorAll('[data-lc="entry"], .hmgo, .hmgo2')].find(node=>node.getClientRects().length)?.focus({preventScroll:true});
  }
  function restoreNativeSession() {
    // Lifestyle-map recommendations use this engine without replacing the native quiz draft.
    if (nativeSession) {
      const previous = nativeSession;
      nativeSession = null;
      exit();
      state.answers = cleanAnswers(previous.answers);
      state.step = previous.step;
      state.result = null;
      if (previous.active && complete()) showResults({preserveView:true});
    }
  }
  function open(step=-1) {
    restoreNativeSession();
    updateLabels();
    state.returnFocus = document.activeElement;
    state.step = Number.isInteger(step) && step>=0 && step<QUESTIONS.length ? step : -1;
    hide(); closeSheets(); welcome.hidden = true;
    wrap.hidden = false; setModalBackground(true); drawQuiz();
  }
  function drawQuiz(focus=true) {
    clearTimeout(advanceTimer);
    const N = QUESTIONS.length;
    if (state.step < 0) {
      const back = complete();
      body.innerHTML = `<div class="lc-top"><span class="lc-stamp">${local('Liverpool Home Match','利物浦 · 我的找房指南')}</span><button type="button" class="lc-ghost" data-hm="browse">${local('Just browse the map ↘','先逛逛地图 ↘')}</button></div>
        ${back?`<p class="lc-back"><span>${local('Welcome back. Your last shortlist is saved on this device.','欢迎回来，上次的找房结果已保存在本设备。')}</span><button type="button" class="lc-link" data-hm="results">${local('Open my Home Match card →','查看上次结果 →')}</button></p>`:''}
        <div class="lc-left"><h1 class="lc-title" id="hmTitle">${local('Which Liverpool home fits your <em>everyday</em> life?','找到适合你日常生活的利物浦公寓')}</h1>${SQUIGGLE}</div>
        <p class="lc-lede">${local('Answer 8 short questions about your campus, meals, study spots and weekends. Your shortlist lands right here on the map, with the reasons each home fits.','从校区、吃饭、学习到周末安排，回答 8 个简短问题。你的备选公寓会直接标在地图上，并说明适合的理由。')}</p>
        <ul class="lc-kw hm-doodles" aria-label="${local('What we look at','我们会参考')}"><li style="--k:#f6dfa0">🛒 ${local('Local amenities','周边生活配套')}</li><li style="--k:#d7e8c4">📚 ${local('Libraries and cafés','图书馆与咖啡馆')}</li><li style="--k:#f3cfc4">🌳 ${local('Parks and sport','公园与运动')}</li><li style="--k:#e3e0f3">🎓 ${local('Teaching buildings','专业教学楼')}</li></ul>
        <ol class="lc-steps"><li><b>${local('1 · Tell us','1 · 回答')}</b>${local('Campus, dinner, study, weekends.','校区、晚餐、学习、周末。')}</li><li><b>${local('2 · Match','2 · 匹配')}</b>${local('Up to 3 homes, numbered on this map.','最多 3 处公寓，标在地图上。')}</li><li><b>${local('3 · Shortlist','3 · 备选')}</b>${local('Compare, copy, or ask about a home.','对比、复制或咨询公寓。')}</li></ol>
        <div class="lc-btns"><button class="lc-btn lc-btn-main" type="button" data-hm="start">${local('Start · about 2 minutes ↗','开始 · 约 2 分钟 ↗')}</button><button class="lc-btn" type="button" data-hm="subject">${local('Find homes by subject','按专业找公寓')}</button></div>
        <p class="lc-fine">${local('Your budget, room-type and favourites filters keep applying. Answers stay in this browser; no name or contact details. A lifestyle shortlist, not a guarantee of availability.','已有的预算、房型和收藏筛选仍然生效。答案只保存在当前浏览器，不需要姓名或联系方式。这是生活偏好参考，不保证实时有房。')}</p>`;
    } else {
      const q = displayQuestion(QUESTIONS[state.step]), value = state.answers[q.id];
      const selected = choice => q.multi ? (value || []).includes(choice) : value === choice;
      const last = state.step === N - 1;
      body.innerHTML = `<div class="lc-q-top"><span class="lc-dots" aria-hidden="true">${QUESTIONS.map((_,index)=>`<i class="${index<=state.step?'on':''}"></i>`).join('')}</span><span class="lc-q-step">${local(`${state.step+1} of ${N}`,`第 ${state.step+1} 题，共 ${N} 题`)}</span><button type="button" class="lc-ghost" data-hm="leave" aria-label="${local('Close the questions','关闭问题')}">×</button></div>
        <h1 class="lc-q" id="hmTitle">${esc(q.q)}</h1>${q.multi?`<p class="lc-banner hm-multi">${local(`Pick up to ${q.max}, then press Next.`,`最多选 ${q.max} 项，然后点“下一步”。`)}</p>`:''}${q.hint?`<p class="lc-fine hm-hint">${esc(q.hint)}</p>`:''}
        <div class="lc-opts" role="group" aria-label="${esc(q.q)}">${q.opts.map(([choice,emoji,label,note])=>`<button type="button" class="lc-opt" data-hm="opt" data-v="${choice}" aria-pressed="${selected(choice)}"><span class="e" aria-hidden="true">${emoji}</span><b>${esc(label)}</b><small>${esc(note)}</small></button>`).join('')}</div>
        <div class="lc-q-foot"><button class="lc-btn" type="button" data-hm="back">${local('Back','上一步')}</button><button class="lc-btn lc-btn-main" style="flex:0 1 auto" type="button" data-hm="next" ${answered(q)?'':'disabled'}>${last?local('Show my homes','生成我的找房推荐卡'):local('Next','下一步')} →</button></div>`;
    }
    const heading = body.querySelector('h1'); if (heading) heading.tabIndex=-1;
    card?.setAttribute('aria-label', state.step<0 ? local('Liverpool Home Match','利物浦找房测试') : local(`Question ${state.step+1} of ${N}`,`第 ${state.step+1} 题，共 ${N} 题`));
    if (focus) { heading?.focus({preventScroll:true}); if (card) card.scrollTop = 0; }
  }
  wrap.addEventListener('click', event => {
    event.stopPropagation();
    if (event.target===wrap) {if(state.step<0)closeQuiz();return;}
    const button=event.target.closest('[data-hm]'); if (!button) return;
    const action=button.dataset.hm;
    if (action!=='opt') clearTimeout(advanceTimer);
    if (action==='browse') closeQuiz();
    else if (action==='leave') {if (complete()) showResults(); else closeQuiz();}
    else if (action==='subject') {closeQuiz(false);minimize();window.SubjectDock?.open();}
    else if (action==='start') {state.step=0;drawQuiz();}
    else if (action==='results') showResults();
    else if (action==='back') {state.step--;drawQuiz();}
    else if (action==='next') {
      if (!answered(QUESTIONS[state.step])) return;
      if (state.step<QUESTIONS.length-1) {state.step++;drawQuiz();} else showResults();
    } else if (action==='opt') {
      const q=QUESTIONS[state.step], choice=button.dataset.v;
      if (!q?.opts.some(option=>option[0]===choice)) return;
      if (q.multi) {
        let selected=[...(state.answers[q.id] || [])];
        if (choice==='any') selected=selected.includes('any')?[]:['any'];
        else if (selected.includes(choice)) selected=selected.filter(item=>item!==choice);
        else {
          selected=selected.filter(item=>item!=='any');
          if (selected.length>=q.max) {toast(local(`This question allows up to ${q.max} picks — please drop one first.`,`这道题最多选 ${q.max} 项，请先取消一项。`));return;}
          selected.push(choice);
        }
        state.answers[q.id]=selected;
      } else state.answers[q.id]=choice;
      saveAnswers();
      // Update in place so keyboard and multi-select users keep their focus.
      body.querySelectorAll('[data-hm="opt"]').forEach(option=>option.setAttribute('aria-pressed',String(q.multi?state.answers[q.id].includes(option.dataset.v):state.answers[q.id]===option.dataset.v)));
      body.querySelector('[data-hm="next"]').disabled=!answered(q);
      // Same rhythm as the Life Quiz: a single choice moves on by itself after a short beat.
      if (!q.multi) {
        const s=state.step; clearTimeout(advanceTimer);
        advanceTimer=setTimeout(()=>{if (!wrap.hidden && state.step===s) {if (state.step<QUESTIONS.length-1) {state.step++;drawQuiz();} else showResults();}},320);
      }
    }
  });
  document.getElementById('hmX').addEventListener('click', event=>{event.stopPropagation();closeQuiz();});
  wrap.addEventListener('keydown', event=>{
    if (event.key==='Escape') {event.preventDefault();event.stopPropagation();if(state.step>=0)body.querySelector('[data-hm="leave"]')?.click();else closeQuiz();return;}
    if (event.key!=='Tab') return;
    const focusable=[...wrap.querySelectorAll('button,a[href],input,select,textarea,[tabindex="0"]')].filter(node=>!node.disabled && node.getClientRects().length);
    const first=focusable[0],last=focusable[focusable.length-1];
    if (!first) {event.preventDefault();return;}
    const active=document.activeElement;
    if (event.shiftKey && (active===first || !focusable.includes(active))) {event.preventDefault();last.focus();}
    else if (!event.shiftKey && (active===last || !focusable.includes(active))) {event.preventDefault();first.focus();}
  });

  const mapLayer=mk('g',{id:'hmLayer','aria-hidden':'true'});
  over.insertBefore(mapLayer,document.getElementById('homes'));
  function clearHighlights() {
    document.querySelectorAll('.hmpick,.hmtop').forEach(node=>node.classList.remove('hmpick','hmtop'));
    mapLayer.textContent='';
  }
  function setMinimized(minimized) {
    panel.classList.toggle('mini',minimized);panel.classList.toggle('is-mini',minimized);document.body.classList.toggle('hm-mini',minimized);
    miniButton.textContent=minimized?local('Open ▴','展开 ▴'):local('Fold ▾','收起 ▾');
    miniButton.setAttribute('aria-label',minimized?local('Expand the home-match card','展开找房推荐卡'):local('Collapse to see the map','收起卡片查看地图'));
    const head=document.getElementById('hmResH');
    if(head){const p=state.result&&complete()?persona():null;head.innerHTML=minimized&&p?`<span aria-hidden="true">${p.stamp}</span> ${esc(p.title)}`:esc(local('My Liverpool home','我的利物浦住所'));}
    miniButton.setAttribute('aria-expanded',String(!minimized));
    window.SubjectDock?.render();
  }
  function minimize() {if(state.active)setMinimized(true);}
  function showResults({preserveView=false}={}) {
    if (!complete()) {state.step=QUESTIONS.findIndex(q=>!answered(q));drawQuiz();return;}
    const wasMini=panel.classList.contains('mini');
    closeQuiz(false);
    // Background refresh must not close the filter/keyboard subject picker
    // that triggered it, or steal its map position and focus.
    if (!preserveView) {hide();closeSheets();}
    state.result=matchHomes();state.selected=0;
    if(!state.active)state.homesHidden=document.getElementById('homesPanel').hidden;
    state.active=true;document.getElementById('homesPanel').hidden=true;
    if(hidden.has('home'))setLayer('home',true);
    clearHighlights();mapbox.classList.toggle('hm-on',state.result.picks.length>0);
    state.result.picks.slice().reverse().forEach((entry,ri)=>{const index=state.result.picks.length-1-ri,node=els.get(entry.h.id);node?.classList.add('hmpick');node?.classList.toggle('hmtop',index===0);node?.parentNode?.appendChild(node);});
    renderPanel();panel.hidden=embeddedLifeMap;miniButton.hidden=embeddedLifeMap;setMinimized(embeddedLifeMap || (preserveView?wasMini:false));
    selectResult(0,preserveView || embeddedLifeMap);
    if(!preserveView && (embeddedLifeMap || isNarrow()))fitRecommendations();
    if(!preserveView && !embeddedLifeMap){const heading=document.getElementById('hmName')||document.getElementById('hmResH');heading.tabIndex=-1;heading.focus({preventScroll:true});}
    if(embeddedLifeMap && typeof window.dispatchEvent==='function')window.dispatchEvent(new Event('lifemapchange'));
  }
  function priceText(home) {
    const prices=[];
    if(home.pe)prices.push(local(`En-suite from £${home.pe}`,`独卫单间 £${home.pe} 起`));
    if(home.ps)prices.push(local(`Studio from £${home.ps}`,`独立套间 £${home.ps} 起`));
    if(!prices.length && home.plo)prices.push(local(`Room from £${home.plo}`,`房间 £${home.plo} 起`));
    return prices.length?`${prices.join(' · ')}${local(' / week (past reference price)','／周（历史参考价）')}`:local('No reference starting price recorded','暂无参考起价记录');
  }
  function answerChips() {
    const pick=(id)=>{const q=QUESTIONS.find(x=>x.id===id),dq=q&&displayQuestion(q),v=state.answers[id];const o=dq&&dq.opts.find(x=>x[0]===(Array.isArray(v)?v[0]:v));return o?`${o[1]} ${o[2]}`:'';};
    return ['campus','night','walk'].map(pick).filter(Boolean);
  }
  function detailHTML(entry,index) {
    if(!entry)return '';
    return `<article class="mcard ${index===0?'top':''} on" data-i="${index}"><div class="mhead"><span class="mnum">${entry.h.n}</span><div><span class="mkicker">${index===0?local('Try this first','优先看看'):local('Also worth shortlisting','也值得加入备选')} · ${local('Map number','地图编号')} ${entry.h.n}</span><h3>${esc(entry.h.name)}</h3><div class="mmeta">${esc(areaOf(entry.h.area))} · ${esc(entry.h.addr)}</div></div></div><div class="fits">${local('Based on your preferences, these amenities matter most','根据你的偏好，这些周边配套最值得关注')}</div><ul class="why2">${entry.good.map(item=>`<li><span aria-hidden="true">${metrics[item.key].ico}</span><span>${esc(metrics[item.key].good(entry.h))}</span></li>`).join('')}${entry.trade?`<li class="trade"><span aria-hidden="true">⚖️</span><span>${local('Trade-off: ','需要权衡：')}${esc(metrics[entry.trade.key].bad(entry.h))}</span></li>`:''}</ul><div class="mprice">${esc(priceText(entry.h))}</div>${entry.h.pso?`<p class="srcnote2">${local('Past records did not list a lettable room type, so current availability needs a fresh check.','历史记录未列出可租房型，当前是否有房需要重新确认。')}</p>`:''}<div class="macts"><button type="button" data-hmr="view" data-i="${index}">${local('View on map','在地图上查看')}</button><button type="button" data-hmr="card" data-i="${index}">${local('Home details','公寓详情')}</button><button type="button" class="cta2" data-hmr="ask" data-i="${index}">${local('Ask about this home','咨询这处公寓')}</button></div></article>`;
  }
  function renderPanel() {
    const profile=persona(),result=state.result,picks=result.picks;
    const scope=resultScope(), tones=['#f6dfa0','#d7e8c4','#f3cfc4'];
    panelBody.innerHTML=`<div class="lc-hero"><div class="lc-polaroid hm-polaroid" aria-hidden="true"><span>${profile.stamp}</span></div><div class="lc-who lc-left"><p class="lc-kicker">${local('Your everyday style','你的日常生活偏好')}</p><h3 class="lc-name" id="hmName" tabindex="-1">${esc(profile.title)}</h3>${SQUIGGLE}</div></div>
      <p class="lc-line">“${esc(profile.desc)}”</p><ul class="lc-kw" aria-label="${local('Your key answers','你的关键选择')}">${answerChips().map((k,i)=>`<li style="--k:${tones[i]}">${esc(k)}</li>`).join('')}</ul>
      ${picks.length?`<div class="lc-btns"><button type="button" class="lc-btn lc-btn-main" data-hmr="copy">${local('Copy my shortlist ↗','复制找房推荐卡 ↗')}</button></div>${picks.length>1?`<button type="button" class="lc-btn lc-btn-wide lc-btn-sun hm-cmp3" data-hmr="compare3">${picks.length===3?local('Compare these 3 side by side ↔','对比这三套 ↔'):local(`Compare these ${picks.length} side by side ↔`,`对比这 ${picks.length} 套 ↔`)}</button>`:''}`:''}
      <div id="hmCopyFallback" hidden><label for="hmCopyText">${local('Automatic copy failed — long-press the text below to copy: ','自动复制失败，请长按或选中下方文字复制：')}</label><textarea id="hmCopyText" class="hm-copy-field" readonly rows="5"></textarea></div>
      <section class="lc-homes" aria-labelledby="hmHomesH"><h2 id="hmHomesH">${local('Homes that fit your everyday','适合你日常生活的公寓')}</h2>
      <p class="lc-sub">${esc(scope)} ${local('They’re numbered on the map; tap one to see why it fits.','地图上已标出编号，点一处查看适合的理由。')}</p>
      ${!picks.length?`<div class="hm-empty" role="status"><h3>${local('No home meets every criterion right now','暂时没有同时符合全部条件的公寓')}</h3><p>${local(`Your active map filters${state.answers.walk==='mid'?' and the 15-minute commute cap':''} left no common results. We will not relax your criteria for you.`,`当前地图筛选${state.answers.walk==='mid'?'与 15 分钟通勤上限':''}没有共同匹配的房源。系统不会自动放宽你的条件。`)}</p><div class="lc-tools"><button type="button" class="lc-link" data-hmr="reset-filters">${local('Clear the map filters and try again','清除地图筛选后重试')}</button><button type="button" class="lc-link" data-hmr="edit">${local('Change my quiz answers','修改测试答案')}</button></div></div>`
      :`<ol class="lc-home-list" id="hmHomeList">${picks.map((entry,index)=>`<li><button type="button" class="lc-home" data-hmr="view" data-i="${index}" aria-current="${index===state.selected}"><span class="lc-num">${entry.h.n}</span><span class="lc-home-txt"><small>${index===0?local('Try this first','优先看看'):local('Also worth a look','也值得看看')}</small><b>${esc(entry.h.name)}</b><em>${esc(metrics[entry.good[0]?.key]?.good(entry.h) || priceText(entry.h))}</em></span><span aria-hidden="true">↗</span></button></li>`).join('')}</ol>
      <div id="hmDetail">${detailHTML(picks[state.selected] || picks[0],picks[state.selected]?state.selected:0)}</div>`}
      <div class="lc-tools"><button type="button" class="lc-link" data-hmr="subject">${local('Pick my subject building','再按专业看看')}</button><button type="button" class="lc-link" data-hmr="edit">${local('Change answers','修改答案')}</button></div>
      <p class="srcnote2">${local(`How we rank: we weight these ${HOMES.length} homes by distance and by how many listed places sit nearby, using the habits you picked. It is not a personality test and not a rating of living quality. Places come from the supplied map data (sourced from OpenStreetMap, © OpenStreetMap contributors) and are not independently verified, so entries may be missing or closed. Circles mark roughly 10 minutes of distance and the connectors are not real walking routes. Subject commutes use the nearest teaching building; green-space distance uses its boundary, not its gate. Rent is a historical record dated 17 October 2026; your budget filter still applies, price plays no part in the lifestyle ranking, and availability, routes and opening status need separate confirmation.`,`推荐方式：根据你选择的生活习惯，结合距离与周边已记录场所数量，对 ${HOMES.length} 处公寓进行加权排序。这不是人格测评，也不是居住质量评级。地点来自提供的地图资料（来源：OpenStreetMap，© OpenStreetMap 贡献者），未经独立核实，可能有遗漏或已停业。圆圈表示约 10 分钟的距离范围，连线不是真实步行路线。专业通勤按最近教学楼估算，绿地距离按边界而非入口计算。租金为 2026 年 10 月 17 日的历史记录；预算筛选仍然生效，但价格不参与生活偏好排名。房态、路线和营业情况都需另行确认。`)}</p></section>
      <footer class="lc-foot"><button type="button" class="lc-link" data-hmr="again">${local('Retake Home Match','重新开始')}</button><button type="button" class="lc-link" data-hmr="chooser">${local('Back to quiz choices','返回测试选择')}</button></footer>`;
  }
  function exit({restoreFocus=false}={}) {
    closeQuiz(false);state.active=false;panel.hidden=true;mapbox.classList.remove('hm-on');clearHighlights();
    document.getElementById('homesPanel').hidden=state.homesHidden;
    window.SubjectDock?.render();
    if(restoreFocus)focusEntry();
  }
  panelBody.addEventListener('click',event=>{
    const button=event.target.closest('[data-hmr]'),item=event.target.closest('.mcard');
    if(!button){if(item)selectResult(Number(item.dataset.i));return;}
    event.stopPropagation();
    const action=button.dataset.hmr,index=Number(button.dataset.i),entry=state.result?.picks[index];
    if(action==='view' && entry){if(isNarrow())minimize();selectResult(index);}
    else if(action==='card' && entry){minimize();selectResult(index);show(entry.h,true);}
    else if(action==='ask' && entry)openContact(entry.h,button);
    else if(action==='edit')open(0);
    else if(action==='subject'){minimize();window.SubjectDock?.open();}
    else if(action==='again'){restoreNativeSession();state.answers={};saveAnswers();exit();open(0);}
    else if(action==='reset-filters'){resetHomeFilters();showResults();}
    else if(action==='compare3'){openCompare3(button);}
    else if(action==='compare'){compare.clear();state.result.picks.forEach(p=>compare.add(p.h.id));syncCompare();openCompare(button);}
    else if(action==='copy')copyResult();
    else if(action==='chooser'){exit();window.LifeQuiz?.open();}
  });
  async function copyResult() {
    const picks=state.result?.picks || [];if(!picks.length)return;
    const profile=persona(),url=new URL(location.href);url.search='';url.hash=HomeTools.makeHash(isChinese()?'zh':'en');
    const text=local(`My Liverpool home-match card: ${profile.title}\n${profile.desc}\nTry first: ${picks[0].h.name}${picks.length>1?'\nOther picks: '+picks.slice(1).map(p=>p.h.name).join(', '):''}\nThis is a lifestyle reference, not live availability. Explore the map: ${url.href}`,`我的利物浦找房推荐卡：${profile.title}\n${profile.desc}\n优先看看：${picks[0].h.name}${picks.length>1?'\n其他推荐：'+picks.slice(1).map(p=>p.h.name).join('、'):''}\n这是一份生活偏好参考，不代表实时房态。查看地图：${url.href}`);
    try {await navigator.clipboard.writeText(text);toast(local('Copied — paste it to your friend.','已复制，可以粘贴发给朋友。'));}
    catch(_){const box=document.getElementById('hmCopyFallback'),input=document.getElementById('hmCopyText');box.hidden=false;input.value=text;input.focus();input.select();toast(local('Please copy it manually from the text box.','请从文本框中手动复制。'));}
  }
  document.getElementById('hmClose').addEventListener('click',event=>{event.stopPropagation();exit({restoreFocus:true});});
  miniButton.addEventListener('click',event=>{event.stopPropagation();setMinimized(!panel.classList.contains('mini'));selectResult(state.selected);});
  panel.addEventListener('keydown',event=>{if(event.key==='Escape'){event.stopPropagation();exit({restoreFocus:true});}});

  function selectResult(index,keepView=false) {
    const entry=state.result?.picks[index];if(!entry){mapLayer.textContent='';return;}
    state.selected=index;
    panelBody.querySelectorAll('.lc-home[data-i]').forEach(node=>node.setAttribute('aria-current',String(Number(node.dataset.i)===index)));
    const detail=document.getElementById('hmDetail');if(detail && detail.firstElementChild?.dataset?.i!==String(index))detail.innerHTML=detailHTML(entry,index);
    mapLayer.textContent='';
    const center=entry.h.hm.r,radius=10*80/13,ring=[];
    for(let step=0;step<=64;step++){const angle=step/64*Math.PI*2;ring.push(W(center[0]+Math.cos(angle)*radius,center[1]+Math.sin(angle)*radius));}
    mk('path',{class:'hmring',d:toD(ring,true)},mapLayer);
    const points=ring.slice(),spots=[];
    entry.good.forEach(reason=>{const metric=metrics[reason.key],near=metric.spot && entry.h.hm.near[metric.spot];if(near?.p.r && !spots.some(spot=>spot.near===near))spots.push({near,emoji:metric.ico});});
    spots.slice(0,4).forEach(spot=>{
      const point=W(...spot.near.p.r);points.push(point);
      mk('path',{class:'hmlink',d:`M${entry.h.a[0].toFixed(1)} ${entry.h.a[1].toFixed(1)}L${point[0].toFixed(1)} ${point[1].toFixed(1)}`},mapLayer);
      const group=mk('g',{class:'hmspot',transform:`translate(${point[0].toFixed(1)} ${point[1].toFixed(1)})`},mapLayer);
      mk('circle',{r:13,fill:'#fffaf0',stroke:'#b5462f','stroke-width':2.4},group);
      mk('text',{y:5,'text-anchor':'middle','font-size':14},group).textContent=spot.emoji;
      const label=placeName(spot.near.p,'');if(label)mk('text',{class:'lbl',y:29,'font-size':14},group).textContent=label.length>26?label.slice(0,25)+'…':label;
    });
    mk('circle',{class:'hmglow',cx:entry.h.p[0].toFixed(1),cy:entry.h.p[1].toFixed(1),r:27},mapLayer);
    if(!keepView)fitPoints(points);
  }
  function fitPoints(points,{viewport}={}) {
    const bounds=mapbox.getBoundingClientRect(),width=mapbox.clientWidth,height=mapbox.clientHeight;
    if(!width || !height || !points.length)return false;
    let left=60,right=width-44,top=72,bottom=height-76;
    const resultBounds=panel.getBoundingClientRect();
    if(embeddedLifeMap){
      if(isNarrow()){left=44;right=width-48;top=180;bottom=height-220;}
      else{left=Math.min(285,width*.32);right=width-65;top=76;bottom=height-220;}
      const safe=viewport || window.LifeMapViewport;
      if(safe && [safe.left,safe.right,safe.top,safe.bottom].every(Number.isFinite)){
        left=Math.max(0,Math.min(width-48,safe.left));right=Math.max(left+48,Math.min(width,safe.right));
        top=Math.max(0,Math.min(height-48,safe.top));bottom=Math.max(top+48,Math.min(height,safe.bottom));
      }
    }else if(panel.hidden || panel.classList.contains('pd-docked')){/* card tucked away: use the whole map */}
    else if(isNarrow()){if(resultBounds.top-bounds.top>220)bottom=Math.min(bottom,resultBounds.top-bounds.top-8);}
    else if(resultBounds.left-bounds.left<120)left=Math.max(left,resultBounds.right-bounds.left+12);
    // Small preview frames may leave little map space. Fitting must not undo
    // the user's explicit expansion of the result list.
    bottom=Math.max(top+48,bottom);
    if(embeddedLifeMap)window.LifeMapViewport={left,right,top,bottom};
    const xs=points.map(point=>point[0]),ys=points.map(point=>point[1]);
    const x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
    const minSpace=embeddedLifeMap?1:80;
    const zoom=Math.min(Math.max(minSpace,right-left)/((x1-x0+70)*fitK),Math.max(minSpace,bottom-top)/((y1-y0+70)*fitK));
    z=Math.max(embeddedLifeMap?0.1:1,Math.min(zmax(),zoom));tx=(left+right)/2-(x0+x1)/2*fitK*z;ty=(top+bottom)/2-(y0+y1)/2*fitK*z;
    render(true);
    return {viewport:{left,right,top,bottom},zoom:z};
  }
  function resultScope() {
    return local(`${usesSubject()?'The commute reference uses the nearest teaching building for your subject; not every class is held there.':'Commute reference: '+campusName()+'.'} Your current map filters still apply${state.answers.walk==='mid'?', keeping the estimated walk strictly within 15 minutes':''}.`,`${usesSubject()?'通勤参考采用该专业最近的教学楼，并不代表所有课程都在这里上。':'通勤参考：'+campusName()+'。'}当前地图筛选仍然生效${state.answers.walk==='mid'?'，预计步行时间严格控制在 15 分钟以内':''}。`);
  }
  /* ---------- "Compare these 3": the recommended homes side by side, in the map's compare dialog ---------- */
  let cmp3Open=false;
  function openCompare3(from) {
    const picks=state.result?.picks || [];
    const wrapEl=document.getElementById('cmpWrap'),grid=document.getElementById('cmpGrid'),title=document.getElementById('cmpTitle'),note=document.getElementById('cmpNote');
    if(picks.length<2 || !wrapEl || !grid)return false;
    // keep the map's own compare tray in step with what is on screen
    try{compare.clear();picks.forEach(p=>compare.add(p.h.id));syncCompare();}catch(_){}
    cmpReturn=from || document.activeElement;hide();closeSheets();
    renderCompare3();wrapEl.classList.add('cmp3');cmp3Open=true;wrapEl.hidden=false;
    document.getElementById('cmpX')?.focus({preventScroll:true});
    if(title)title.textContent=picks.length===3?local('Compare these 3 homes','对比这三套公寓'):local(`Compare these ${picks.length} homes`,`对比这 ${picks.length} 套公寓`);
    if(note)note.textContent=local('Prices are past reference listings (17 Oct 2026), not live availability. Walk times are straight-line estimates, not routes. Bills are not recorded in this data, so ask each provider whether bills are included.','价格为历史参考房源（2026 年 10 月 17 日），并非实时房态。步行时间为直线距离估算，不是实际路线。资料中没有水电账单信息，请向各公寓确认是否包含账单。');
    return true;
  }
  function renderCompare3() {
    const picks=state.result?.picks || [],grid=document.getElementById('cmpGrid');if(!grid)return;
    grid.style.setProperty('--n',picks.length);grid.textContent='';
    const cell=(cls,html)=>{const d=document.createElement('div');d.className=cls;d.innerHTML=html;grid.append(d);return d;};
    const best=(vals,dir='low')=>{const have=vals.filter(v=>Number.isFinite(v));return have.length>=2&&new Set(have).size>1?(dir==='low'?Math.min(...have):Math.max(...have)):null;};
    const badge=local('Best of these','这几套中最好');
    const row=(label,vals,fmt,dir)=>{const b=dir?best(vals,dir):null;cell('rl',esc(label));vals.forEach((v,i)=>cell(v==null||v===''?'v na':'v',v==null||v===''?esc(local('Not recorded','暂无记录')):fmt(v,picks[i])+(dir&&v===b?` <span class="best">${esc(badge)}</span>`:'')));};
    const mins=n=>local(`about ${n} min`,`约 ${n} 分钟`);
    const near=(h,key)=>h.hm.near[key];
    cell('rl','');
    picks.forEach((e,i)=>cell('hd',`<span class="n">${e.h.n}</span><span class="k3">${i===0?local('Try this first','优先看看'):local('Also worth a look','也值得看看')}</span><b>${esc(e.h.name)}</b><span>${esc(areaOf(e.h.area))}</span><span>${esc(e.h.addr)}</span>`));
    row(local('En-suite from','独卫单间起价'),picks.map(e=>e.h.pe??null),v=>`<b>£${v}</b>${local(' / week','／周')}`,'low');
    row(local('Studio from','独立套间起价'),picks.map(e=>e.h.ps??null),v=>`<b>£${v}</b>${local(' / week','／周')}`,'low');
    row(local('Room types listed','已记录房型'),picks.map(e=>{const t=[];if(e.h.pe)t.push(local('En-suite','独卫单间'));if(e.h.ps)t.push(local('Studio','独立套间'));if(!t.length&&e.h.plo)t.push(local('Room','房间'));return e.h.pso?local('No rooms listed on 17 Oct 2026','2026 年 10 月 17 日未列出可租房型'):t.join(' · ')||null;}),v=>esc(v));
    row(local(`Walk to ${campusName()}`,`步行至${campusName()}`),picks.map(e=>e.h.hm.campus),v=>`<b>${esc(mins(v))}</b>`,'low');
    row(local('Nearest supermarket','最近的超市'),picks.map(e=>near(e.h,'super')?.m??null),(v,e)=>`<b>${esc(mins(v))}</b><br><small>${esc(placeName(near(e.h,'super').p,local('supermarket','超市')))}</small>`,'low');
    row(local('Cafés within ~10 min','约 10 分钟内咖啡馆'),picks.map(e=>countOf(e.h,'cafe10')),(v,e)=>`<b>${v}</b>${near(e.h,'cafe')?`<br><small>${esc(local('Nearest: ','最近：')+placeName(near(e.h,'cafe').p,local('café','咖啡馆'))+' · '+mins(near(e.h,'cafe').m))}</small>`:''}`,'high');
    row(local('Nearest green space','最近的绿地'),picks.map(e=>near(e.h,'park')?.m??null),v=>`<b>${esc(mins(v))}</b><br><small>${esc(local('to the edge, not the gate','按边界计算，非入口'))}</small>`,'low');
    row(local('Nearest library','最近的图书馆'),picks.map(e=>near(e.h,'lib')?.m??null),v=>`<b>${esc(mins(v))}</b>`,'low');
    row(local('Bills','账单'),picks.map(()=>local('Not in this data — ask the provider','资料未记录，请向公寓确认')),v=>`<span class="na">${esc(v)}</span>`);
    row(local('Rating','评分'),picks.map(e=>e.h.rn?e.h.rr:null),(v,e)=>`<b>${Number(v).toFixed(1)}★</b> · ${esc(local(`${e.h.rn} reviews`,`${e.h.rn} 条评价`))}`,'high');
    cell('rl',esc(local('Why it fits you','适合你的理由')));
    picks.forEach(e=>cell('v why3',`<ul>${e.good.map(item=>`<li><span aria-hidden="true">${metrics[item.key].ico}</span> ${esc(metrics[item.key].good(e.h))}</li>`).join('')}</ul>`));
    cell('rl',esc(local('Trade-off','需要权衡')));
    picks.forEach(e=>cell(e.trade?'v trade3':'v na',e.trade?`⚖️ ${esc(metrics[e.trade.key].bad(e.h))}`:esc(local('No major trade-off for your answers','按你的选择没有明显短板'))));
    cell('rl act','');
    picks.forEach((e,i)=>{
      const d=cell('act','');
      const view=document.createElement('button');view.type='button';view.className='cta';view.textContent=local('View on map','在地图上查看');
      view.addEventListener('click',ev=>{ev.stopPropagation();closeCompare();if(isNarrow())minimize();selectResult(i);window.dispatchEvent(new CustomEvent('hm-compare-view',{detail:{id:e.h.id}}));});
      const det=document.createElement('button');det.type='button';det.className='rm';det.textContent=local('Home details','公寓详情');
      det.addEventListener('click',ev=>{ev.stopPropagation();closeCompare();minimize();selectResult(i);show(e.h,true);});
      const ask=document.createElement('button');ask.type='button';ask.className='rm';ask.textContent=local('Ask about this home','咨询这处公寓');
      ask.addEventListener('click',()=>openContact(e.h,ask));
      d.append(view,det,ask);
    });
  }
  {
    const wrapEl=document.getElementById('cmpWrap');
    if(wrapEl && typeof MutationObserver==='function')new MutationObserver(()=>{if(wrapEl.hidden && cmp3Open){cmp3Open=false;wrapEl.classList.remove('cmp3');const title=document.getElementById('cmpTitle');try{if(title)title.textContent=t('cmpTitle');}catch(_){}}}).observe(wrapEl,{attributes:true,attributeFilter:['hidden']});
    document.addEventListener('llc-language-change',()=>{if(cmp3Open && !document.getElementById('cmpWrap').hidden)openCompare3(cmpReturn);});
  }
  function getSnapshot() {
    return {picks:(state.result?.picks || []).map(entry=>({
      id:entry.h.id,n:entry.h.n,name:entry.h.name,price:priceText(entry.h),
      reasons:entry.good.map(item=>metrics[item.key].good(entry.h)),
      trade:entry.trade?metrics[entry.trade.key].bad(entry.h):'',
      historicalUnavailable:!!entry.h.pso
    })),scope:state.active?resultScope():'',persona:state.result&&complete()?persona().title:''};
  }
  function applyAnswers(input) {
    let answers;
    try{answers=linkedAnswers(JSON.stringify(input));}catch(_){return false;}
    if(!answers)return false;
    // External recommendations never replace the native quiz draft or active result.
    if (!nativeSession) nativeSession={answers:cleanAnswers(state.answers),step:state.step,active:state.active};
    state.answers=answers;welcome.hidden=true;showResults();return true;
  }
  function fitRecommendations({viewport,extraPoints=[]}={}) {
    const picks=state.result?.picks || [];
    if(!picks.length)return false;
    // Fit actual markers AND their drawn labels, rather than an unrelated
    // city-centre anchor that can push the picks under the parent overlays.
    const points=picks.flatMap(entry=>[entry.h.a,entry.h.p]);
    points.push(...extraPoints.filter(point=>Array.isArray(point)&&point.length===2&&point.every(Number.isFinite)));
    const fitted=fitPoints(points,{viewport});
    return fitted?{...fitted,count:picks.length}:false;
  }
  function fitAllHomes({viewport}={}) {
    // This is a view-only affordance of the embedded test result. It does not
    // relax filters, replace recommendations, or save a different answer set.
    if(!embeddedLifeMap || !HOMES.length)return false;
    const fitted=fitPoints(HOMES.flatMap(home=>[home.a,home.p]),{viewport});
    return fitted?{...fitted,count:HOMES.length}:false;
  }
  function selectHome(id) {
    const index=state.result?.picks.findIndex(entry=>entry.h.id===id) ?? -1;
    if(index<0)return false;
    const home=state.result.picks[index].h;
    selectResult(index);hide();show(home,true);return true;
  }
  function refresh() {if(state.active && complete())showResults({preserveView:true});}
  // A shared entry chooser owns the desktop/mobile quiz entry buttons.
  const languagePicker=document.createElement('div');
  languagePicker.className='lc-language-tools hm-languages';languagePicker.setAttribute('role','group');
  languagePicker.setAttribute('aria-label','Language / 语言');
  const chooserBack=document.createElement('button');chooserBack.type='button';chooserBack.className='lc-link';
  chooserBack.style.marginRight='auto';chooserBack.addEventListener('click',()=>{closeQuiz(false);window.LifeQuiz?.open();});
  languagePicker.append(chooserBack);
  const languageButtons=['en','zh'].map(lang=>{
    const button=document.createElement('button');button.type='button';button.className='hm-lang-btn';
    button.dataset.hmLang=lang;button.lang=lang==='zh'?'zh-Hans':'en';button.textContent=lang==='zh'?'中文':'EN';
    button.addEventListener('click',()=>{setLang(lang,true);});
    languagePicker.append(button);return button;
  });
  body.before(languagePicker);
  function updateLabels() {
    chooserBack.textContent=local('Back to quiz choices','返回测试选择');
    document.getElementById('hm').lang=isChinese()?'zh-Hans':'en';
    panel.lang=isChinese()?'zh-Hans':'en';
    document.getElementById('hmX').setAttribute('aria-label',local('Close Home Match','关闭找房测试'));
    document.getElementById('hmClose').setAttribute('aria-label',local('Close home-match results','关闭找房推荐'));
    document.getElementById('hmClose').textContent='×';
    document.getElementById('hmToast').lang=isChinese()?'zh-Hans':'en';
    languageButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.hmLang===(isChinese()?'zh':'en'))));
    setMinimized(panel.classList.contains('mini'));
  }
  document.addEventListener('llc-language-change',()=>{
    updateLabels();
    if (!wrap.hidden) {const sc=card?card.scrollTop:0;drawQuiz(false);if(card)card.scrollTop=sc;}
    if (state.active && state.result) {renderPanel();selectResult(state.selected,true);}
    if(embeddedLifeMap)window.dispatchEvent(new Event('lifemapchange'));
  });
  updateLabels();
  document.getElementById('subject')?.addEventListener('change',()=>{if(state.active && state.answers.campus==='uol')refresh();});
  ['homeSearch','homeBudget','homeRoom','homeDestination','homeWalk'].forEach(id=>{
    document.getElementById(id)?.addEventListener(id==='homeSearch'?'input':'change',refresh);
  });
  ['favoritesOnly','resetHomeFilters'].forEach(id=>document.getElementById(id)?.addEventListener('click',refresh));
  document.getElementById('mbHomes')?.addEventListener('click',()=>{if(state.active)exit();},true);
  document.getElementById('viewResults')?.addEventListener('click',()=>{if(state.active)exit();},true);
  function consumeLinkedAnswers() {
    const params = new URLSearchParams(location.hash.replace(/^#/, ''));
    if (!params.has('hmAnswers')) return null;
    const home = HomeTools.readRoute(location.hash).home, values = params.getAll('hmAnswers');
    // Do not leave preference payloads in later copied or shared map links.
    params.delete('hmAnswers');
    try {
      const url = new URL(location.href); url.hash = params.toString();
      history.replaceState(history.state, '', url.href);
    } catch (_) {}
    if (home) return 'home';
    const answers = values.length === 1 ? linkedAnswers(values[0]) : null;
    if (!answers) {
      toast(local('These Home Match answers are incomplete or corrupted. Please finish Home Match again.','这份找房测试答案不完整或已损坏，请重新完成测试。'));
      return 'invalid';
    }
    state.answers = answers; // Session only; existing saved answers stay untouched.
    welcome.hidden = true;
    showResults();
    return 'valid';
  }
  addEventListener('hashchange',()=>{
    const handoff = consumeLinkedAnswers();
    if(embeddedLifeMap && !handoff)return;
    if(HomeTools.readRoute(location.hash).home){
      if(state.active)exit();else if(!wrap.hidden)closeQuiz(false);
    } else if(handoff === 'invalid') {
      if(state.active)exit();
      open();
    }
  });
  document.addEventListener('click',event=>{
    if(state.active && homeFilters.favoritesOnly && event.target.closest('[data-favorite]'))queueMicrotask(refresh);
  });
  addEventListener('resize',()=>{if(state.active){window.SubjectDock?.render();selectResult(state.selected,true);}});
  window.HomeMatch=Object.freeze({openCompare3,open,minimize,exit,refresh,applyAnswers,getSnapshot,selectHome,fitRecommendations,fitAllHomes,isActive:()=>state.active,getState:()=>({answers:cleanAnswers(state.answers),step:state.step,active:state.active,minimized:panel.classList.contains('mini'),homeIds:state.result?.picks.map(entry=>entry.h.id) || []})});
  // Shared homes and the completed lifestyle test can enter the map directly.
  const handoff = consumeLinkedAnswers();
  const exploreDirect = new URLSearchParams(location.hash.replace(/^#/, '')).get('explore') === '1';
  if(!window.LLC_ENTRY_OWNED && !embeddedLifeMap && handoff !== 'valid' && !HomeTools.readRoute(location.hash).home && (handoff === 'invalid' || !exploreDirect))open();
})();
