-- מילוי בסיס הנתונים
USE online_store;

-- הוספת מחלקות
INSERT INTO Departments (name) VALUES 
('אלקטרוניקה'),
('ביגוד'),
('בית וגן'),
('ספורט ונופש'),
('טכנולוגיה'),
('מזון ומשקאות');

-- צריך לעדכן את הסיסמאות
-- הוספת משתמשים
INSERT INTO Users (name, email, password_hash, role, department_id, address) VALUES
-- מנהל אחד
('יוסי כהן', 'admin@store.com', '$2b$10$BtjuqS2XQVVuJg2A6UaHze/aKYdqyw1oWbn1UbfCzYlYWtxW2VorW', 'admin', 1, 'רחוב הרצל 15, תל אביב'), -- admin123

-- מחסנאים (2)
('דני לוי', 'danny@store.com', ' $2b$10$N3FW0WRGtCUqr4G1bkarTeTx2AX2E8MacCIUFCBOPZXQx8bP0HPKK', 'storekeeper', 1, 'רחוב דיזנגוף 25, תל אביב'), -- storekeeperdanny
('שרה גולד', 'sara@store.com', '$2b$10$kGFmvFkv6/eiNYF3Wr1QJulWXgWK5rbz.hccJMAEpewLBUJ2wMDPi', 'storekeeper', 2, 'רחוב אלנבי 30, תל אביב'), -- storekeepersara

-- עובדים (7)
('משה ישראל', 'moses@store.com', '$2b$10$RdamK90X4jpb1plpX3sSbuTuT/FPfmrcS8X69Ng7FZW64ThL8kUUa', 'worker', 1, 'רחוב בן יהודה 5, תל אביב'), -- pass1
('רחל אברהם', 'rahel@store.com', '$2b$10$dcuttvUmU79gQm0TVeJaQ.EdYh.840L8/hvOM38QlDzz.PKvvpdTG', 'worker', 2, 'רחוב קינג ג\'ורג\' 10, תל אביב'), -- password
('אבי שלום', 'avi@store.com', ' $2b$10$xeD/2qXHHZDUbZ5Cey3HvOEOZRUgYuKvyzCTZ1.47McSm5Hy1q6uK', 'worker', 3, 'רחוב רוטשילד 20, תל אביב'), -- avi123
('נעמה דוד', 'Naama@store.com', '$2b$10$NJxQD.x3hyBRTO0b.M3Sz.9yLstxB4pXWa6SiUDUa3OPmU4T2QRFK', 'worker', 4, 'רחוב שינקין 8, תל אביב'), -- namna1
('עמית גרין', 'amit@store.com', '$2b$10$XF1FRkfN91O3Krs9zRYYSO2rtMExZQJlEJdGxz5mqNu9SdAvArDia', 'worker', 5, 'רחוב פרישמן 12, תל אביב'), -- AMIT12
('יעל בלום', 'yaal@store.com', '$2b$10$hop/Pe7pZIw0GaVLieaz.e65LZ0An.dXMaUpdDGdZ6tjGdKmw13Fa', 'worker', 6, 'רחוב דיזנגוף 40, תל אביב'), -- 123456
('רון סילבר', 'ron@store.com', '$2b$10$A4GCln.P6WqGlXHR9UmWVu8uRfk5yWwDRLojBESUMpMLeNb5CBfZi', 'worker', 1, 'רחוב אבן גבירול 18, תל אביב'), -- pas123

-- לקוחות (10)
('אלכס מור', 'alex@gmail.com', '$2b$10$6MLM2ypof3o9JzB2W.C8W.veUPK3D.ExwlPNrb21KJRNl6DmW32um', 'customer', NULL, 'רחוב יהודה הלוי 22, תל אביב'), -- zaqwer
('תמר לוין', 'tamar@gmail.com', '$2b$10$bkbI9V/or6jQu4gQtBbmt.dcA7eMvi.f1JYa5emZCToe9i4cVh8ki', 'customer', NULL, 'רחוב ביאליק 14, תל אביב'), -- 2468
('יונתן רוזן', 'yonatan@gmail.com', '$2b$10$SIsin66aTIbJa7mrfWtgduN.o0s1gGu52fmKsNIIt/tGjz.6Aa3X2', 'customer', NULL, 'רחוב חנה סנש 9, תל אביב'), -- Aa123
('מיכל כהן', 'michal@gmail.com', '$2b$10$sQU31HiHO636QoUlP5AWGehhzSW.K0tLcVnjlWq9UQCXal5x6C806', 'customer', NULL, 'רחוב בוגרשוב 33, תל אביב'), -- mc12
('דוד שפירא', 'david@gmail.com', '$2b$10$JQdtdEnaKBWVqRTSHTkrOO0Osp11lUW0khG.TS4SE9Bm1/2SD.oEi', 'customer', NULL, 'רחוב נורדאו 7, תל אביב'), -- 789BbB
('ליאת אבני', 'liat@gmail.com', '$2b$10$ZqL/ncQDK/9RVIGA12HCweWBc.Yr/LLoPMju5sC8oj3v3YAwwyPXS', 'customer', NULL, 'רחוב מונטיפיורי 11, תל אביב'), -- liat123
('גיא פרץ', 'gay@gmail.com', '$2b$10$8fa5WAyI.Uv5QCHwbeW/.uywdDnJpNYs0wV7dix2xOYMemKSaV/6y', 'customer', NULL, 'רחוב מלכי ישראל 6, תל אביב'), -- 12345678
('הדר בן דוד', 'hadar@gmail.com', '$2b$10$ljbaMhaib791si1YY8Mc0uQAjFBpEnYwBOmYuBh2zjNgguUM/sWGK', 'customer', NULL, 'רחוב אחד העם 19, תל אביב'), -- abcdef!
('עדן טל', 'eden@gmail.com', '$2b$10$/cfP6xdvJT1Y3liLpztN3uaD4J6yEoiFhYUERfx5PuoaMPtx8/bkS', 'customer', NULL, 'רחוב לבונטין 4, תל אביב'), -- eden987
('נתן כרמל', 'natan@gmail.com', '$2b$10$wePd/Osi.QDcwzxku4Ta7.g3hmWEiEgTcJy6BFm.gPlg7fmZ8kxgO', 'customer', NULL, 'רחוב זמנהוף 13, תל אביב'); -- natan

-- הוספת מוצרים (100 מוצרים)
-- מחלקת אלקטרוניקה
INSERT INTO Products (name, description, price, quantity, min_quantity, department_id, image) VALUES
('סמארטפון iPhone 15', 'טלפון חכם מתקדם עם מצלמה 48MP', 3599.99, 25, 5, 1, 'https://i0.wp.com/greenmobile.co.il/wp-content/uploads/2023/11/iphone_15_pro_natural_titanium_pdp_image_position-1__wwen.jpg?fit=1000%2C1000&ssl=1'),
('סמארטפון Samsung Galaxy S24', 'טלפון אנדרואיד עם מסך 6.2 אינץ', 3199.99, 20, 5, 1, 'https://www.ivory.co.il/files/catalog/org/1706102216C16Ip.webp'),
('מחשב נייד Dell XPS 13', 'מחשב נייד 13 אינץ עם מעבד Intel i7', 4999.99, 15, 3, 1, 'https://www.misradia.co.il/cdn/shop/files/original-38453.jpg?v=1700736461&width=700'),
('מחשב נייד MacBook Air M2', 'מחשב נייד Apple עם שבב M2', 5999.99, 10, 2, 1, 'https://goldtop.co.il/upload_files/220961.JPG'),
('אוזניות אלחוטיות AirPods Pro', 'אוזניות עם ביטול רעש אקטיבי', 999.99, 50, 10, 1, 'https://mikicom.co.il/Cat_499090_1807.webp'),
('אוזניות Sony WH-1000XM5', 'אוזניות מקצועיות עם ביטול רעש', 1299.99, 30, 8, 1, 'https://peimot.com/Cat_471170_23497.jpg'),
('טלוויזיה Samsung 65" QLED', 'טלוויזיה 4K עם טכנולוגיית QLED', 4999.99, 12, 3, 1, 'https://www.homecenter.co.il/cdn/shop/files/1722240960016-1.JPG?v=1722429487'),
('טלוויזיה LG OLED 55"', 'טלוויזיה OLED עם איכות תמונה מעולה', 5999.99, 8, 2, 1, 'https://static.wixstatic.com/media/4e1c6b_873c5380b26141948a18cc9988068860~mv2.gif'),
('מטען אלחוטי', 'מטען אלחוטי מהיר 15W', 149.99, 40, 10, 1, 'https://www.sollan.co.il/wp-content/uploads/2022/04/Baseus-PPLG-A01-5.jpg'),
('כבל USB-C 2M', 'כבל טעינה ומידע באיכות גבוהה', 39.99, 100, 20, 1, 'https://static.wixstatic.com/media/4e1c6b_1c097cc3cd304d89bb43e47ff08414f0~mv2.gif'),
('מקלדת מכנית Razer', 'מקלדת גיימינג עם תאורה RGB', 599.99, 25, 5, 1, 'https://www.storytech.co.il/wp-content/uploads/2024/09/80-8.png'),
('עכבר גיימינג Logitech G502', 'עכבר עם חיישן מדויק ו-11 כפתורים', 299.99, 35, 8, 1, 'https://www.storytech.co.il/wp-content/uploads/2024/09/1-31.webp'),
('מסך מחשב 27" 4K', 'מסך IPS עם רזולוציה 4K', 1599.99, 18, 4, 1, 'https://d2d22nphq0yz8t.cloudfront.net/6cbcadef-96e0-49e9-b3bd-9921afe362db/www.payngo.co.il/media/catalog/product/d/z/dz-01-27mr400-b.png/w_700,h_700,r_contain'),
('מצלמה Canon EOS R5', 'מצלמה דיגיטלית מקצועית', 12999.99, 5, 1, 1, 'https://gvanimstudiosh.com/Cat_497671_1219.webp'),
('רמקול Bluetooth JBL', 'רמקול נייד עמיד במים', 299.99, 45, 10, 1, 'https://www.misradia.co.il/cdn/shop/files/original-43703.jpg?v=1704269407&width=700'),
('בנק כוח 20000mAh', 'בנק כוח מהיר עם יציאות מרובות', 199.99, 60, 15, 1, 'https://mtmobile28.co.il/wp-content/uploads/2025/06/%D7%9E%D7%98%D7%A2%D7%A0%D7%9F-%D7%A0%D7%99%D7%99%D7%93.jpg'),
('מגן זכוכית לטלפון', 'מגן זכוכית מחוסמת', 29.99, 200, 50, 1, 'https://mtmobile28.co.il/wp-content/uploads/2024/01/GLASS%D7%96%D7%9B%D7%95%D7%9B%D7%99%D7%AA-%D7%90%D7%99%D7%99%D7%A4%D7%95%D7%9F-%D7%AA%D7%9E%D7%A8.jpg'),

-- מחלקת ביגוד
('חולצת פולו Ralph Lauren', 'חולצת פולו קלאסית מכותנה', 399.99, 40, 8, 2, 'https://mallshoes.co.il/wp-content/uploads/2020/10/%D7%A8%D7%90%D7%9C%D7%A3-%D7%9C%D7%95%D7%A8%D7%9F-RALPH-LAUREN-POLO-TSHIRT-SHORT-MENS-Midnight-Express.jpg'),
('גינס Levi 501', 'גינס קלאסי בגזרה ישרה', 329.99, 50, 10, 2, 'https://amiam.co.il/wp-content/uploads/2024/01/classic-jeans-600x600.d110a0.webp'),
('נעלי Nike Air Max', 'נעלי ספורט נוחות עם כריות אוויר', 599.99, 35, 7, 2, 'https://sneakersonline.co.il/wp-content/uploads/2025/05/air-max-bw-og-persian-violet-2021-2-600x600.webp'),
('נעלי Adidas Stan Smith', 'נעלי ספורט קלאסיות בצבע לבן', 449.99, 30, 6, 2, 'https://mallshoes.co.il/wp-content/uploads/2020/07/ADIDAS-Stan-Smith-White-Dark-Blue-Tail-8.jpg'),
('שמלת קיץ Zara', 'שמלה קלילה לעונת הקיץ', 199.99, 25, 5, 2, 'https://example.com/zara_dress.jpg'),
('חליפה', 'חליפת עבודה אלגנטית', 1999.99, 15, 3, 2, 'https://www.golf-il.co.il/pub/media/catalog/product/cache/d947544493069166d5cc618d4417273e/5/8/5828907_112_a-17192291311312262.jpg'),
('מעיל עור', 'זקט עור אמיתי באיכות גבוהה', 899.99, 20, 4, 2, 'https://d3m9l0v76dty0.cloudfront.net/system/photos/11042339/large/2cba46f742c43949b307a36490272188.jpg'),
('חולצת כפתורים Calvin Klein', 'חולצה מעוצבת לאירועים', 299.99, 30, 6, 2, 'https://surfin.co.il/wp-content/uploads/2024/10/03AMSH_8264-1-861x1065-1.b197b0.webp'),
('מכנסי טרנינג Puma', 'מכנסיים נוחים לפעילות ספורטיבית', 179.99, 45, 9, 2, 'https://liatsboutique.co.il/wp-content/uploads/2025/02/%D7%98%D7%99%D7%99%D7%A5-%D7%9C%D7%95%D7%92%D7%95-1.jpg'),
('גרביים צמר', 'גרביים חמים מצמר מרינו', 79.99, 100, 20, 2, 'https://shoppu.co.il/cdn/shop/products/TX2103BK.jpg?v=1608034858&width=980'),
('כובע מצחייה New Era', 'כובע בייסבול עם לוגו', 149.99, 40, 8, 2, 'https://neweracap.co.il/wp-content/uploads/60595320_3QL-1000x1000.jpg'),
('תחתונים Calvin Klein', 'תחתונים מכותנה באיכות גבוהה', 99.99, 60, 12, 2, 'https://mallshoes.co.il/wp-content/uploads/2020/08/UNDERWEAR-3PCS-CK-1.png'),
('בגד ים נשים', 'בגד ים דו חלקי באיכות גבוהה', 199.99, 30, 6, 2, 'https://example.com/bikini.jpg'),
('מעיל חורף North Face', 'מעיל חם ועמיד במים', 799.99, 20, 4, 2, 'https://d3m9l0v76dty0.cloudfront.net/system/photos/15682065/large/36d22a7fed2d7e405ed3ef62d002aa0f.jpg'),
('חגורת עור', 'חגורה מעור אמיתי', 149.99, 35, 7, 2, 'https://images.cdn-files-a.com/uploads/6037003/2000_6232417b8ad92.jpg'),
('כפפות חורף', 'כפפות חמות מצמר', 59.99, 50, 10, 2, 'https://d3m9l0v76dty0.cloudfront.net/system/photos/3217105/large/0c7cf9f2fe2baa1055d92754b3234cc9.jpg'),
('צעיף קשמיר', 'צעיף רך וחם', 199.99, 25, 5, 2, 'https://assets.digitalcontent.marksandspencer.app/image/upload/w_1008,h_1310,q_auto,f_auto,e_sharpen/SD_03_T09_6400_PK_X_EC_90'),

-- מחלקת בית וגן
('מיטת זוגית עם מזרן', 'מיטה מעוצבת עם מזרן אורתופדי', 2999.99, 12, 3, 3, 'https://alinasleep.co.il/wp-content/uploads/2023/02/22-53-05_01-5-1024x768.jpg'),
('ספה 3 מושבים', 'ספה נוחה לסלון', 3999.99, 8, 2, 3, 'https://www.sitdown.co.il/wp-content/uploads/2023/07/alexander-290_FROZEN-0271_resize-1.jpg'),
('שולחן אוכל מעץ', 'שולחן עגול ל-6 סועדים', 1999.99, 15, 3, 3, 'https://tivhaetz.com/wp-content/uploads/2024/06/%D7%A9%D7%95%D7%9C%D7%97%D7%9F-%D7%91%D7%95%D7%9C%D7%95%D7%A0%D7%99%D7%94-1.jpg'),
('כיסאות מטבח (4 יחידות)', 'כיסאות מעוצבים למטבח', 799.99, 20, 4, 3, 'https://foldees.co.il/cdn/shop/files/b0a5332eeaac228150487856919b1fa5_9f210a4b-7308-489b-b669-4bf9ab2de697.jpg?v=1739968745&width=700'),
('מקרר Samsung 500L', 'מקרר משפחתי עם מקפיא', 4999.99, 10, 2, 3, 'https://zabilo.com/33700-small_default/rt47cg6006s9.jpg'),
('תנור אפיה Bosch', 'תנור רב תכליתי עם גריל', 2499.99, 15, 3, 3, 'https://www.homecenter.co.il/cdn/shop/files/1719141165937-1.jpg?v=1734619839&width=823'),
('מכונת כביסה 8KG', 'מכונת כביסה אוטומטית', 1999.99, 12, 3, 3, 'https://www.homecenter.co.il/cdn/shop/files/1704894479957-1.jpg?v=1749186987&width=823'),
('מייבש כביסה', 'מייבש בנפח 7 ק"ג', 2299.99, 10, 2, 3, 'https://www.homecenter.co.il/cdn/shop/files/1726387689943-1.jpg?v=1726477949&width=823'),
('שואב אבק Dyson', 'שאיב אבק אלחוטי', 1699.99, 18, 4, 3, 'https://cdn.istores.co.il/image/upload/c_fill,h_100,w_100/c_fit,h_100,w_100/dpr_2/clients/135527/d89b3dab33456b8d63f4e1f391bd96689b38afc3.jpg'),
('מזגן עילי 1.5 כוח סוס', 'מזגן אינוורטר חסכוני', 1799.99, 12, 3, 3, 'https://electra.mashav.com/images/facebook/a-inverter600.jpg'),
('מנורת שולחן LED', 'מנורה מעוצבת עם תאורת LED', 199.99, 40, 8, 3, 'https://www.lior-lighting.com/wp-content/uploads/2024/01/18660-05-30.webp'),
('שטיח סלון 2x3', 'שטיח מעוצב לסלון', 599.99, 25, 5, 3, 'https://www.homecenter.co.il/cdn/shop/files/1645963540054-2.jpg?v=1712562122&width=823'),
('מראה לחדר שינה', 'מראה מעוצבת עם מסגרת', 299.99, 30, 6, 3, 'https://www.homecenter.co.il/cdn/shop/files/1645963540054-2.jpg?v=1712562122&width=823'),
('כלים לבישול (סט)', 'סט סירים וחביתות', 799.99, 20, 4, 3, 'https://www.chefpoint.co.il/wp-content/uploads/2020/01/1.jpg'),
('מטאטא רצפה', 'מטאטא לניקוי רצפה', 79.99, 50, 10, 3, 'https://tyroler.co.il/wp-content/uploads/2024/06/Broom_Lightweight_01_main_notext-1.jpg'),
('מצעים למיטה זוגית', 'סט מצעים מכותנה', 299.99, 35, 7, 3, 'https://www.homecenter.co.il/cdn/shop/files/5150118541-1.jpg?v=1710261139&width=823'),
('וילונות לסלון', 'וילונות מעוצבות', 399.99, 25, 5, 3, 'https://cdn.exiteme.com/exitetogo/www.vilonet.co.il/gallery/products/09BA0151-81D3-05BE-3BAA-FD2C3D6380DB.jpg'),

-- מחלקת ספורט ונופש
('אופני הרים Trek', 'אופני הרים מקצועיים', 4999.99, 8, 2, 4, 'https://bikebook.co.il/wp-content/uploads/2024/02/nirvana-tour-base-grey-5.webp'),
('כדורגל Nike', 'כדורגל מקצועי', 149.99, 30, 6, 4, 'https://mikasatukasa.co.il/wp-content/uploads/2023/07/SCB0078_01.png'),
('כדורסל Spalding', 'כדורסל רשמי', 199.99, 25, 5, 4, 'https://www.dvarimbego.co.il/pub/123432/%D7%99%D7%95%D7%A0%D7%99%D7%A1%D7%A4%D7%95%D7%A8%D7%98/887791143716.jpg?quality=65&height=380&mode=max'),
('מחבט טניס Wilson', 'מחבט טניס מקצועי', 699.99, 15, 3, 4, 'https://www.daniel-fitness.co.il/images/itempics/3411_201220211636411_large.jpg'),
('נעלי ריצה Asics', 'נעלי ריצה מקצועיות', 599.99, 20, 4, 4, 'https://brands-israel.co.il/wp-content/uploads/2025/02/IMG_0441.jpeg'),
('תיק גב לטיולים', 'תיק גב 40 ליטר', 399.99, 18, 4, 4, 'https://d3m9l0v76dty0.cloudfront.net/system/photos/15479428/large/37351e8f8e4933eaae83299a2a49e777.jpg'),
('אוהל ל-4 אנשים', 'אוהל עמיד במים', 899.99, 10, 2, 4, 'https://d3m9l0v76dty0.cloudfront.net/system/photos/15479428/large/37351e8f8e4933eaae83299a2a49e777.jpg'),
('שק שינה', 'שק שינה חם לחורף', 299.99, 15, 3, 4, 'https://joseph-car-shop.co.il/wp-content/uploads/2021/12/1000448620.jpg'),
('מזרן שטח', 'מזרן אוויר לקמפינג', 199.99, 20, 4, 4, 'https://www.homecenter.co.il/cdn/shop/files/1698930048216-1_54223183-8d13-40c6-b02f-4bbf95e3a390.jpg?v=1749981083&width=823'),
('פנס ראש LED', 'פנס ראש עמיד במים', 149.99, 30, 6, 4, 'https://www.sollan.co.il/wp-content/uploads/2023/11/%D7%A4%D7%A0%D7%A1-%D7%A8%D7%90%D7%A92.jpg'),
('בקבוק מים נירוסטה', 'בקבוק מים 1 ליטר', 79.99, 50, 10, 4, 'https://d3m9l0v76dty0.cloudfront.net/system/photos/12605596/large/d5365e07a02a17fea9d65675863c9521.jpg'),
('משקפי שמש Ray-Ban', 'משקפי שמש מגנים מUV', 699.99, 25, 5, 4, 'https://d3m9l0v76dty0.cloudfront.net/system/photos/11040571/large/7ffaf201784d823aa344643a4d0df5e5.jpg'),
('קסדה לאופניים', 'קסדה מגנה', 199.99, 20, 4, 4, 'https://i0.wp.com/bet-htinok.co.il/wp-content/uploads/2024/11/%D7%A7%D7%A1%D7%93%D7%94-%D7%90%D7%95%D7%A4%D7%A0%D7%99%D7%99%D7%9D-KALOFUN-%D7%9E%D7%A7%D7%A6%D7%95%D7%A2%D7%99-%D7%9E%D7%99%D7%93%D7%95%D7%AA-M-L-XL-8-1.jpg?fit=1000%2C1000&quality=89&ssl=1'),
('מדחום דיגיטלי', 'מדחום עמיד במים', 99.99, 30, 6, 4, 'https://www.medikit.co.il/html5/web/8879/35741ImageFile2.jpg'),
('רולרבליידס', 'רולרבליידס מקצועיים', 799.99, 12, 3, 4, 'https://contents.mediadecathlon.com/p2075873/1cr1/k$0109625342e5e5b879c3f69bdcefad8d/fit100-fitness-inline-skates-blackslashgrey.jpg?format=auto&f=768x0'),
('קרש גלישה', 'קרש גלישה למתחילים', 1299.99, 6, 2, 4, 'https://storenet.co.il/wp-content/uploads/2025/03/3-4.png'),
('חבל טיפוס', 'חבל טיפוס 30 מטר', 399.99, 15, 3, 4, 'https://www.daniel-fitness.co.il/images/itempics/3360_201020211225391_large.jpg'),

-- מחלקת טכנולוגיה
('מדפסת HP LaserJet', 'מדפסת לייזר שחור לבן', 899.99, 15, 3, 5, 'https://d3m9l0v76dty0.cloudfront.net/system/photos/9841085/show/dc06950edf5cd605e9dbecf2994e73cf.jpg'),
('נתב WiFi 6 TP-Link', 'נתב מהיר עם WiFi 6', 599.99, 20, 4, 5, 'https://shop.virtualgraffiti.co.il/cdn/shop/files/Aruba-AP22.png?v=1737664433'),
('דיסק קשיח חיצוני 2TB', 'דיסק קשיח נייד', 399.99, 25, 5, 5, 'https://www.misradia.co.il/cdn/shop/files/original-48507.jpg?v=1704112204&width=700'),
('SSD 1TB Samsung', 'כונן SSD מהיר', 599.99, 30, 6, 5, 'https://ksp.co.il/shop/items/131674.jpg?v=5'),
('מצלמת אבטחה WiFi', 'מצלמת אבטחה חכמה', 299.99, 35, 7, 5, 'https://static.wixstatic.com/media/68366d_536ed099d174489d8c729ba8111808d4~mv2.jpeg/v1/fill/w_625,h_625,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/68366d_536ed099d174489d8c729ba8111808d4~mv2.jpeg'),
('רמקול שקוע קיר', 'רמקול מחובר לקיר', 150.99, 20, 4, 5, 'https://peimot.com/Cat_471170_19428.jpg'),
('מנורה חכמה Philips Hue', 'מנורה עם שליטה מהטלפון', 199.99, 40, 8, 5, 'https://store.topaudio.co.il/cdn/shop/files/8719514340121-929001953310-Hue_WA-5W-GU10-2P-EUR-RTP-TRN_360x.jpg?v=1718799611'),
('שעון חכם Apple Watch', 'שעון חכם עם GPS', 1999.99, 15, 3, 5, 'https://mtmobile28.co.il/wp-content/uploads/2023/06/se-2-40mm.webp'),
('טאבלט iPad Air', 'טאבלט 10.9 אינץ', 2999.99, 12, 3, 5, 'https://www.cls.co.il/files/products/product366806_model0_image0_2025-03-18_17-12-06.jpg'),
('מחשב נייד גיימינג', 'מחשב נייד עם כרטיס גרפיקה', 6999.99, 8, 2, 5, 'https://d2d22nphq0yz8t.cloudfront.net/6cbcadef-96e0-49e9-b3bd-9921afe362db/www.payngo.co.il/media/catalog/product/0/0/00cca3491689064be63f8c0cb63f0652_5_3_1_2_3_1_1.png/w_700,h_700,r_contain'),
('מיקרופון USB', 'מיקרופון להקלטה', 299.99, 25, 5, 5, 'https://peimot.com/Cat_471170_20559.webp'),
('וובקאם 4K', 'מצלמת רשת באיכות 4K', 399.99, 20, 4, 5, 'https://d3m9l0v76dty0.cloudfront.net/system/photos/14047943/large/e4b920764b0596c534f0ad17c66be098.png'),
('כרטיס זיכרון 128GB', 'כרטיס זיכרון מהיר', 99.99, 50, 10, 5, 'https://static.wixstatic.com/media/4e1c6b_5e98ac50f61b44e1bf030d8d06e50d12~mv2.gif'),
('מטען רכב מהיר', 'מטען לרכב עם USB-C', 79.99, 40, 8, 5, 'https://shop.provisionisr.co.il/images/itempics/PR-QI-CC_03092024162302_large.jpg'),
('מתאם USB-C ל-HDMI', 'מתאם לחיבור למסך', 59.99, 60, 12, 5, 'https://www.bestec.co.il/wp-content/uploads/2025/02/CMS.jpg'),

-- מחלקת מזון ומשקאות
('קפה אקספרסו איטלקי', 'קפה איכותי מאיטליה', 89.99, 100, 20, 6, 'https://www.coffee-express.co.il/images/thumbs/0008558_-3-3-.jpeg'),
('תה ירוק יפני', 'תה ירוק מיוחד מיפן', 49.99, 80, 16, 6, 'https://shoppu.co.il/cdn/shop/files/5_148f91ab-4615-4153-a2d6-3b5aeb33b981.jpg?v=1720384698&width=980'),
('שוקולד בלגי', 'שוקולד איכותי מבלגיה', 39.99, 150, 30, 6, 'https://galitzki-chocolate.co.il/wp-content/uploads/2025/05/WhatsApp-Image-2025-05-25-at-19.20.02-5.jpeg'),
('דבש טבעי', 'דבש מפרחי בר', 69.99, 60, 12, 6, 'https://lfbwinery.com/wp-content/uploads/2023/07/%D7%94%D7%93%D7%A8%D7%99%D7%9D-%D7%97%D7%A6%D7%99-1-removebg-preview.d110a0.webp'),
('שמן זית כתית ', 'שמן זית איכותי', 79.99, 40, 8, 6, 'https://raselhanut.co.il/wp-content/uploads/2023/11/empty-bottle-to-refill-768x768.png'),
('פסטה', 'ספגטי', 19.99, 200, 40, 6, 'https://d226b0iufwcjmj.cloudfront.net/items/large/3689.jpg?v=13'),
('יין אדום', 'יין הר חרמון איכותי', 199.99, 30, 6, 6, 'https://d226b0iufwcjmj.cloudfront.net/product-images/global/6019/1276790/large.jpg'),
('גבינה פרמזן', 'גבינה איטלקית מיושנת', 149.99, 25, 5, 6, 'https://example.com/parmesan.jpg'),
('בירה בלגית', 'בירה מיוחדת מבלגיה', 29.99, 100, 20, 6, 'https://wnf.co.il/media/catalog/product/cache/a3ca0856bdb6fa30c49bf0b073341741/d/u/duvel-330.jpg'),
('מים מינרלים', 'מים מינרלים טבעיים', 9.99, 300, 60, 6, 'https://savtott.co.il/wp-content/uploads/2024/12/%D7%9E%D7%99%D7%9D%D7%9D%D7%9D.jpg'),
('אגוזי מלך', 'אגוזי מלך טריים', 59.99, 80, 16, 6, 'https://raselhanut.co.il/wp-content/uploads/2022/01/O8A7610-1-768x512.jpg'),
('שמן קוקוס', 'שמן קוקוס טבעי', 49.99, 50, 10, 6, 'https://raselhanut.co.il/wp-content/uploads/2022/01/%D7%A9%D7%9E%D7%9F-%D7%A7%D7%95%D7%A7%D7%95%D7%A1-%D7%A9%D7%A7%D7%93-%D7%AA%D7%91%D7%95%D7%A8-768x768.png'),
('מלח ים', 'מלח ים טבעי', 19.99, 100, 20, 6, 'https://www.salt.co.il/wp-content/uploads/2015/02/shaker_red_sea.png'),
('וניל אמיתי', 'תמצית וניל טבעית', 39.99, 40, 8, 6, 'https://raselhanut.co.il/wp-content/uploads/2022/01/96129-768x768.jpeg'),
('קינמון מקלות', 'קינמון טבעי', 29.99, 60, 12, 6, 'https://ecdn.speedsize.com/bf110d93-4a13-494f-a7af-a4a0d6a289c5/ayeletspices.co.il/wp-content/uploads/2022/02/Makel-cinamon-scaled.jpg'),
('סוכר חום', 'סוכר חום טבעי', 24.99, 80, 16, 6, 'https://officeandmore.co.il/wp-content/uploads/2022/07/%D7%A1%D7%95%D7%9B%D7%A8-%D7%97%D7%95%D7%9D.jpg'),
('חומץ בלסמי', 'חומץ בלסמי איטלקי', 79.99, 35, 7, 6, 'https://d3m9l0v76dty0.cloudfront.net/system/photos/16191247/large/efce599f77f99f3ae06195d697b8b841.jpeg');

-- הוספת דירוגים (100 דירוגים)
INSERT INTO Ranking (product_id, user_id, comment, rating) VALUES
-- דירוגים למוצרי אלקטרוניקה
(1, 11, 'טלפון מעולה, מהיר ויעיל', 5),
(1, 12, 'איכות תמונה נהדרת', 4),
(1, 13, 'קצת יקר אבל שווה', 4),
(1, 14, 'הטלפון הטוב ביותר ששמתי עליו יד', 5),
(1, 15, 'מצלמה פנטסטית לצילום', 5),
(2, 11, 'סמסונג כמו תמיד באיכות', 4),
(2, 16, 'מסך נהדר וביצועים טובים', 4),
(2, 17, 'טוב אבל לא מרשים כמו האיפון', 3),
(2, 18, 'איכות מצוינת במחיר הוגן', 4),
(3, 12, 'מחשב מהיר ויעיל לעבודה', 5),
(3, 19, 'עיצוב נקי וביצועים מעולים', 4),
(3, 20, 'קצת חם אבל ביצועים מעולים', 4),
(4, 13, 'האיכות של אפל כמו תמיד', 5),
(4, 11, 'מעבד M2 מהיר באופן מדהים', 5),
(4, 14, 'עיצוב מעולה ומקלדת נוחה', 4),
(5, 15, 'איכות שמע נהדרת', 5),
(5, 16, 'ביטול רעש עובד מצוין', 4),
(5, 17, 'נוחות מעולה לשימוש ממושך', 4),
(6, 18, 'איכות שמע מקצועית', 5),
(6, 19, 'יקר אבל שווה כל שקל', 4),
(7, 20, 'איכות תמונה מדהימה', 5),
(7, 11, 'הטלוויזיה הכי טובה שהייתה לי', 5),
(8, 12, 'צבעים מדהימים ובהירות מעולה', 5),
(8, 13, 'איכות OLED מצוינת', 4),
(9, 14, 'מטען נוח ומהיר', 4),
(9, 15, 'עובד מצוין עם האיפון', 4),
(10, 16, 'כבל איכותי וחזק', 4),
(10, 17, 'אורך מספיק לשימוש נוח', 4),
(11, 18, 'מקלדת מעולה לגיימינג', 5),
(11, 19, 'תאורה יפה ותחושה טובה', 4),
(12, 20, 'עכבר מדויק ונוח', 4),
(12, 11, 'הרבה כפתורים שימושיים', 4),
(13, 12, 'מסך חד ובהיר', 5),
(13, 13, 'מעולה לעבודה גרפית', 4),
(14, 14, 'מצלמה מקצועית ברמה גבוהה', 5),
(14, 15, 'איכות תמונה מדהימה', 5),
(15, 16, 'רמקול עם באס מעולה', 4),
(15, 17, 'עמיד במים באמת', 4),
(16, 18, 'נוח לנסיעות', 4),
(16, 19, 'מספיק כוח למספר טעינות', 4),
(17, 20, 'מגן חזק ושקוף', 4),

-- דירוגים למוצרי ביגוד
(18, 11, 'חולצה איכותית ונוחה', 5),
(18, 12, 'בד מעולה ופיט טוב', 4),
(19, 13, 'גינס קלאסי שתמיד טוב', 5),
(19, 14, 'איכות לויס כמו תמיד', 4),
(20, 15, 'נעליים נוחות מאוד', 5),
(20, 16, 'איכות נייקי מעולה', 4),
(21, 17, 'נעליים קלאסיות ונוחות', 4),
(21, 18, 'עיצוב נקי ויפה', 4),
(22, 19, 'שמלה יפה ונוחה', 4),
(22, 20, 'איכות טובה למחיר', 4),
(23, 11, 'חליפה אלגנטית ומתאימה', 5),
(23, 12, 'הבד מעולה והתפירה מדויקת', 4),
(24, 13, 'זקט עור איכותי', 5),
(24, 14, 'נראה מעולה ומרגיש טוב', 4),
(25, 15, 'חולצה מעוצבת ונוחה', 4),
(25, 16, 'איכות קלווין קליין', 4),
(26, 17, 'נוח מאוד לספורט', 4),
(26, 18, 'בד נושם ואיכותי', 4),
(27, 19, 'גרביים חמים ונוחים', 4),
(27, 20, 'איכות מעולה', 4),
(28, 11, 'כובע יפה ונוח', 4),
(28, 12, 'מתאים מצוין', 4),
(29, 13, 'איכות מעולה', 4),
(29, 14, 'נוח ואיכותי', 4),
(30, 15, 'בגד ים יפה ונוח', 4),
(30, 16, 'איכות טובה', 4),
(31, 17, 'מעיל חם ונוח', 5),
(31, 18, 'מעולה לחורף', 4),
(32, 19, 'חגורה איכותית', 4),
(32, 20, 'עור אמיתי ויפה', 4),
(33, 11, 'כפפות חמות', 4),
(33, 12, 'מעולה לחורף', 4),
(34, 13, 'צעיף רך ונוח', 4),
(34, 14, 'איכות מעולה', 4),

-- דירוגים למוצרי בית וגן
(35, 15, 'מיטה נוחה ואיכותית', 5),
(35, 16, 'מזרן מעולה', 4),
(36, 17, 'ספה נוחה מאוד', 4),
(36, 18, 'איכות טובה', 4),
(37, 19, 'שולחן יפה ואיכותי', 4),
(37, 20, 'עץ מעולה', 4),
(38, 11, 'כיסאות נוחים', 4),
(38, 12, 'עיצוב יפה', 4),
(39, 13, 'מקרר מעולה', 5),
(39, 14, 'שקט ויעיל', 4),
(40, 15, 'תנור מעולה', 4),
(40, 16, 'קל לשימוש', 4),
(41, 17, 'מכונה יעילה', 4),
(41, 18, 'שטיפה מעולה', 4),
(42, 19, 'מייבש מהיר', 4),
(42, 20, 'יעיל מאוד', 4),
(43, 11, 'שואב מעולה', 5),
(43, 12, 'חזק ויעיל', 4),
(44, 13, 'מזגן שקט', 4),
(44, 14, 'מעולה לקיץ', 4),
(45, 15, 'מנורה יפה', 4),
(45, 16, 'תאורה נוחה', 4),
(46, 17, 'שטיח יפה', 4),
(46, 18, 'איכות טובה', 4),
(47, 19, 'מראה מעוצבת', 4),
(47, 20, 'איכות מעולה', 4),
(48, 11, 'כלים איכותיים', 4),
(48, 12, 'מעולה לבישול', 4),
(49, 13, 'מסרק טוב', 4),
(49, 14, 'יעיל לניקוי', 4),
(50, 15, 'מצעים נוחים', 4),
(50, 16, 'בד איכותי', 4),
(51, 17, 'וילונות יפים', 4),
(51, 18, 'איכות טובה', 4),

-- דירוגים למוצרי ספורט
(52, 19, 'אופניים מעולים', 5),
(52, 20, 'איכות מעולה', 4),
(53, 11, 'כדור טוב', 4),
(53, 12, 'איכות נייקי', 4),
(54, 13, 'כדורסל מעולה', 4),
(54, 14, 'איכות ספולדינג', 4),
(55, 15, 'מחבט מקצועי', 5),
(55, 16, 'איכות וילסון', 4),
(56, 17, 'נעלי ריצה מעולות', 4),
(56, 18, 'נוחות מאוד', 4),
(57, 19, 'תיק איכותי', 4),
(57, 20, 'נוח לטיולים', 4),
(58, 11, 'אוהל מעולה', 4),
(58, 12, 'עמיד במים', 4),
(59, 13, 'שק שינה חם', 4),
(59, 14, 'מעולה לקמפינג', 4),
(60, 15, 'מזרן נוח', 4),
(60, 16, 'קל לנשיאה', 4),
(61, 17, 'פנס מעולה', 4),
(61, 18, 'תאורה חזקה', 4),
(62, 19, 'בקבוק איכותי', 4),
(62, 20, 'שמר על הטמפרטורה', 4),
(63, 11, 'משקפיים מעולים', 5),
(63, 12, 'הגנה מעולה', 4),
(64, 13, 'קסדה בטוחה', 4),
(64, 14, 'נוחה לחבישה', 4),
(65, 15, 'מדחום מדויק', 4),
(65, 16, 'עמיד במים', 4),
(66, 17, 'רולרבליידס מעולים', 4),
(66, 18, 'נוחים לרגליים', 4),
(67, 19, 'קרש גלישה טוב', 4),
(67, 20, 'מתאים למתחילים', 4),
(68, 11, 'חבל איכותי', 4),
(68, 12, 'חזק ובטוח', 4),

-- דירוגים למוצרי טכנולוגיה
(69, 13, 'מדפסת מעולה', 4),
(69, 14, 'איכות הדפסה טובה', 4),
(70, 15, 'נתב מהיר', 4),
(70, 16, 'כיסוי טוב', 4),
(71, 17, 'דיסק מהיר', 4),
(71, 18, 'נוח לנשיאה', 4),
(72, 19, 'SSD מהיר מאוד', 5),
(72, 20, 'איכות סמסונג', 4),
(73, 11, 'מצלמה חכמה', 4),
(73, 12, 'קלה להתקנה', 4),
(74, 13, 'רמקול חכם מעולה', 4),
(74, 14, 'איכות שמע טובה', 4),
(75, 15, 'מנורה חכמה נוחה', 4),
(75, 16, 'קלה לשליטה', 4),
(76, 17, 'שעון מעולה', 5),
(76, 18, 'תכונות רבות', 4),
(77, 19, 'טאבלט איכותי', 4),
(77, 20, 'מסך מעולה', 4),
(78, 11, 'מחשב גיימינג מעולה', 5),
(78, 12, 'ביצועים מדהימים', 4),
(79, 13, 'מיקרופון איכותי', 4),
(79, 14, 'איכות הקלטה טובה', 4),
(80, 15, 'וובקאם בהירה', 4),
(80, 16, 'איכות 4K מעולה', 4),
(81, 17, 'כרטיס מהיר', 4),
(81, 18, 'נוח לשימוש', 4),
(82, 11, 'מטען מהיר', 4),
(82, 12, 'נוח לרכב', 4),
(83, 13, 'מטהר אוויר מעולה', 4),
(83, 14, 'עבודה שקטה', 4),
(84, 15, 'מתאם שימושי', 4),
(84, 16, 'איכות טובה', 4),

-- דירוגים למוצרי מזון
(85, 17, 'קפה מעולה', 5),
(85, 18, 'טעם איטלקי אותנטי', 4),
(86, 19, 'תה ירוק איכותי', 4),
(86, 20, 'טעם מרענן', 4),
(87, 11, 'שוקולד מעולה', 5),
(87, 12, 'איכות בלגית', 4),
(88, 13, 'דבש טעים', 4),
(88, 14, 'טבעי ואיכותי', 4),
(89, 15, 'שמן זית מעולה', 4),
(89, 16, 'איכות טובה', 4),
(90, 17, 'פסטה איכותית', 4),
(90, 18, 'טעם מעולה', 4),
(91, 19, 'יין מעולה', 5),
(91, 20, 'איכות צרפתית', 4),
(92, 11, 'גבינה טעימה', 4),
(92, 12, 'איכות איטלקית', 4),
(93, 13, 'בירה מעולה', 4),
(93, 14, 'טעם בלגי', 4),
(94, 15, 'מים טעימים', 4),
(94, 16, 'טבעי ונקי', 4),
(95, 17, 'אגוזים טריים', 4),
(95, 18, 'איכות מעולה', 4),
(96, 19, 'שמן קוקוס טוב', 4),
(96, 20, 'טבעי ואיכותי', 4),
(97, 11, 'מלח ים טוב', 4),
(97, 12, 'טעם טבעי', 4),
(98, 13, 'וניל אמיתי', 4),
(98, 14, 'ריח מעולה', 4),
(99, 15, 'קינמון ארומטי', 4),
(99, 16, 'איכות מעולה', 4);

-- הוספת נתונים לתשלום
INSERT INTO Payment (user_id, card_last4, card_expiry, balance) VALUES
(11, '1234', '2026-12-31', 5000.00),
(12, '5678', '2027-03-31', 3500.00),
(13, '9012', '2025-11-30', 7500.00),
(14, '3456', '2026-08-31', 2000.00),
(15, '7890', '2027-01-31', 4500.00),
(16, '2345', '2026-05-31', 6000.00),
(17, '6789', '2025-09-30', 1500.00),
(18, '0123', '2026-10-31', 8000.00),
(19, '4567', '2027-02-28', 3000.00),
(20, '8901', '2026-07-31', 5500.00);

-- הוספת פריטים לעגלת קניות
INSERT INTO CartItems (user_id, product_id, quantity) VALUES
(11, 1, 1),
(11, 18, 2),
(11, 86, 3),
(12, 35, 1),
(12, 20, 1),
(13, 3, 1),
(13, 52, 1),
(14, 76, 1),
(14, 88, 5),
(15, 23, 1),
(15, 63, 1),
(16, 39, 1),
(16, 91, 10),
(17, 78, 1),
(18, 7, 1),
(18, 92, 2),
(19, 55, 1),
(19, 96, 3),
(20, 14, 1),
(20, 31, 1);

-- הוספת הזמנות
INSERT INTO Orders (user_id, total_price, status, address) VALUES
(1, 4039.97, 'arrived', 'רחוב יהודה הלוי 22, תל אביב'),
(2, 4548.98, 'shipped', 'רחוב ביאליק 14, תל אביב'),
(3, 9998.98, 'arrived', 'רחוב חנה סנש 9, תל אביב'),
(4, 2199.94, 'shipped', 'רחוב בוגרשוב 33, תל אביב'),
(5, 1599.98, 'arrived', 'רחוב נורדאו 7, תל אביב'),
(6, 5199.89, 'shipped', 'רחוב מונטיפיורי 11, תל אביב'),
(7, 6999.99, 'arrived', 'רחוב מלכי ישראל 6, תל אביב'),
(8, 5397.98, 'shipped', 'רחוב אחד העם 19, תל אביב'),
(9, 878.96, 'arrived', 'רחוב לבונטין 4, תל אביב'),
(10, 13799.98, 'shipped', 'רחוב זמנהוף 13, תל אביב');

-- הוספת פריטי הזמנות
INSERT INTO OrderItems (order_id, product_id, quantity, price) VALUES
-- הזמנה 1
(1, 1, 1, 3599),
(1, 18, 2, 399),
(1, 86, 1, 89),
-- הזמנה 2  
(2, 35, 1, 2999),
(2, 20, 1, 599),
(2, 91, 50, 19),
-- הזמנה 3
(3, 3, 1, 4999),
(3, 52, 1, 4999),
-- הזמנה 4
(4, 76, 1, 1999),
(4, 88, 5, 39),
-- הזמנה 5
(5, 23, 1, 1999),
-- הזמנה 6
(6, 39, 1, 4999),
(6, 91, 10, 19),
-- הזמנה 7
(7, 78, 1, 6999),
-- הזמנה 8
(8, 7, 1, 4999),
(8, 92, 2, 199),
-- הזמנה 9
(9, 55, 1, 699),
(9, 96, 3, 59),
-- הזמנה 10
(10, 14, 1, 12999),
(10, 31, 1, 799);

-- הוספת בקשות חידוש מלאי
INSERT INTO RestockRequests (product_id, quantity, requested_by, status) VALUES
(1, 20, 2, 'pending'),
(14, 5, 3, 'ordered'),
(35, 8, 2, 'arrived'),
(52, 3, 3, 'pending'),
(78, 2, 2, 'rejected'),
(86, 50, 3, 'ordered'),
(92, 10, 2, 'pending'),
(3, 10, 3, 'arrived'),
(39, 5, 2, 'pending'),
(76, 8, 3, 'ordered');

-- הצגת סטטיסטיקות
SELECT 'סיכום מילוי בסיס הנתונים' as 'סטטוס';
SELECT COUNT(*) as 'מספר מחלקות' FROM Departments;
SELECT COUNT(*) as 'מספר משתמשים' FROM Users;
SELECT COUNT(*) as 'מספר מוצרים' FROM Products;
SELECT COUNT(*) as 'מספר דירוגים' FROM Ranking;
SELECT COUNT(*) as 'מספר הזמנות' FROM Orders;
SELECT COUNT(*) as 'מספר פריטי הזמנות' FROM OrderItems;
SELECT COUNT(*) as 'מספר בקשות חידוש מלאי' FROM RestockRequests;
SELECT COUNT(*) as 'מספר רשומות תשלום' FROM Payment;
SELECT COUNT(*) as 'מספר פריטים בעגלה' FROM CartItems;
SELECT COUNT(*) as 'מספר רשומות פעילות' FROM UserLogs;