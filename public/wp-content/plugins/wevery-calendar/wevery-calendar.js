//
// ページ読み込み時
//
jQuery(document).ready(function(){

	jQuery(".isp-calendar-frame").each( function() {

		// 当月カレンダーをdiv内に表示
		create_business_calendar(jQuery(this));

		// リターン
		return true;
	});

});

// 指定月のカレンダーを表示
// 第1引数： isp-calendar-frame の jQueryオブジェクト
// 第2引数： カレンダーの年（省略時は当年)
// 第3引数： カレンダーの月（省略時は当月）
function create_business_calendar(jq, y, m) {

	// html埋め込みパラメータ
	var bas_holiday = new Array();
	var inc_holiday = new Array();
	var exc_holiday = new Array();
	//2016.06.29 add
	var cst_holiday = new Array();
	var cst_label = new Array();
	var jpn_holiday = new Array();
	var month_future;
	var month_past;
	var s_day;
	//2016.07.20 add
	var sinryo;
	
	// 変数
	var now = new Date();	// 現在時カレンダー
	var arr;				// "yyyy-m"形式の文字列
	var today = false;		// 当月であれば true
	var mydate;				// 表示年月の先頭日
	var firstday;			// 表示年月の先頭日の曜日
	var enddate;			// 表示年月の末日
	var nxt_y;				// 翌月の年
	var nxt_m;				// 翌月の月
	var prv_y;				// 先月の年
	var prv_m;				// 先月の月
	var max_y_f;			// 月送りの限界年
	var max_m_f;			// 月送りの限界月
	var max_y_p;			// 月戻りの限界年
	var max_m_p;			// 月戻りの限界月
	var nxt_link;			// 先月へのリンクhtml
	var prv_link;			// 来月へのリンクhtml
	var day_array;			// 曜日表示文字の配列
	
	// 作業変数
	var today_class = '';
	var check_date;
	var week = -1;
	var holiday;
	var html;				// 出力html
	var values;
	var val;
	var i;
	var diff;

	// 省略時引数のセット
	if(y == undefined) y = now.getFullYear();
	if(m == undefined) m = now.getMonth() + 1;
	while ( jq.attr("class") != "isp-calendar-frame") {
		jq = jq.parent();
	}

	// 当月か確認
	if(y == now.getFullYear() && m == now.getMonth() + 1) {
		today = true;
	}

	// HTML埋め込みパラメータの取得
	values = jq.children(".base-holiday").val();
	values = values.split('&');
	for(i=0; i<values.length; i++) {
		val = values[i].split('=');
		bas_holiday[i] = val[1].split(',');
	}


	values = jq.children(".inc-holiday").val();
	if( values.length > 0) {
		values = values.split('&');
		for(i=0; i<values.length; i++) {
			val = values[i].split('=');
			inc_holiday[val[0]] = val[1].split(',');
		}
	}

	values = jq.children(".exc-holiday").val();
	if( values.length > 0) {
		values = values.split('&');
		for(i=0; i<values.length; i++) {
			val = values[i].split('=');
			exc_holiday[val[0]] = val[1].split(',');
		}
	}
	
	//2016.06.29 add
	values = jq.children(".cst-holiday").val();
	if( values.length > 0) {
		values = values.split('&');
		for(i=0; i<values.length; i++) {
			val = values[i].split('=');
			cst_holiday[val[0]] = val[1].split(',');
		}
	}
	values = jq.children(".cst-label").val();
	if( values.length > 0) {
		values = values.split('&');
		for(i=0; i<values.length; i++) {
			val = values[i].split('=');
			cst_label[val[0]] = val[1].split(',');
		}
	}
	values = jq.children(".jpn-holiday").val();
	if( values.length > 0) {
		values = values.split('&');
		for(i=0; i<values.length; i++) {
			val = values[i].split('=');
			jpn_holiday[val[0]] = val[1].split(',');
		}
	}
	
	sinryo = jq.children(".sinryo").val();

	month_future = parseInt(jq.children(".month_future").val());
	
	month_past = parseInt(jq.children(".month_past").val());

	s_day = parseInt(jq.children(".s_day").val());
	var label_note = jq.children(".label_note").val();


	// 月送りを求める(未来)
	max_y_f = now.getFullYear();
	max_m_f = (now.getMonth() + 1) + month_future;
	if(max_m_f > 12) {
		max_y_f++;
		max_m_f -= 12;
	}
	check_date = new Date(max_y_f, (max_m_f-1), 1);
	mydate = new Date(y, (m-1), 1);
	if((check_date - mydate) < 0) {
		y = max_y_f;
		m = max_m_f;
	}


	// 月送りを求める(過去)
	max_y_p = now.getFullYear();
	max_m_p = (now.getMonth() + 1) - month_past;
	if(max_m_p < 0) {
		max_y_p--;
		max_m_p += 12;
	}
	check_date = new Date(max_y_p, (max_m_p-1), 1);
	mydate = new Date(y, (m-1), 1);
	if((mydate - check_date) < 0) {
		y = max_y_p;
		m = max_m_p;
	}

	arr = y + "-" + m;

	// 翌月、先月を取得
	if(m == 1) {
		nxt_y = y; nxt_m = m + 1; prv_y = y - 1; prv_m = 12;
	} else if(m == 12) {
		nxt_y = y + 1; nxt_m = 1; prv_y = y; prv_m = m - 1;
	} else {
		nxt_y = y; nxt_m = m + 1; prv_y = y; prv_m = m - 1;
	}

	// リンクを取得
	if(y == max_y_f && m == max_m_f) {
		nxt_link = '<div class="move_button nxt_off">&nbsp;</div>';
	} else {
		nxt_link = '<div class="move_button nxt" onclick="create_business_calendar( jQuery(this), ' + nxt_y + ', ' + nxt_m + ')">&nbsp;</div>';
	}

	if(y == max_y_p && m == max_m_p) {
		prv_link = '<div class="move_button prv_off">&nbsp;</div>';
	} else {
		prv_link = '<div class="move_button prv" onclick="create_business_calendar( jQuery(this), ' + prv_y + ', ' + prv_m + ')">&nbsp;</div>';
	}

	// 末日を取得
	mydate = new Date(y, m, 0);
	enddate = mydate.getDate();

	// 指定年指定月１日の曜日
	mydate = new Date(y, (m-1), 1);
	firstday = mydate.getDay();

	// 週始めを取得
	if(s_day == 0) {
		day_array = new Array("日", "月", "火", "水", "木", "金", "土");
	} else if(s_day == 1) {
		day_array = new Array("月", "火", "水", "木", "金", "土", "日");
	} else if(s_day == 2) {
		day_array = new Array("火", "水", "木", "金", "土", "日", "月");
	} else if(s_day == 3) {
		day_array = new Array("水", "木", "金", "土", "日", "月", "火");
	} else if(s_day == 4) {
		day_array = new Array("木", "金", "土", "日", "月", "火", "水");
	} else if(s_day == 5) {
		day_array = new Array("金", "土", "日", "月", "火", "水", "木");
	} else if(s_day == 6) {
		day_array = new Array("土", "日", "月", "火", "水", "木", "金");
	}

	// カレンダーの作成
	html = '<table summary="休診日カレンダー" class="isp-calendar-inner" border="0" cellspacing="0" cellpadding="0"><tbody>'
				+ '<tr><td>' + prv_link + '</td>'
				+ '<td class="calendar-date-title">' + y + ' 年 ' + m + ' 月</td>'
				+ '<td align="right">' + nxt_link + '</td></tr>'
				+ '<tr><td colspan="3">'
				+ '<table summary="休診日カレンダー" class="isp-business-calendar" border="0" cellpadding="0" cellspacing="1"><thead><tr>';

	for(var i=0; i<day_array.length; i++) {
		html += '<th>' + day_array[i] + '</th>';
	}

	html += '</tr></thead><tbody>';


	// 1日になるまで空白のセルを作成
	if(firstday < s_day) {
		diff = Math.abs((7+firstday) - s_day);
	} else {
		diff = Math.abs(firstday - s_day);
	}

	if(diff > 0) {
		html += '<tr valign="middle">';
		for(var i=0; i<diff; i++) {
			html += '<td class="space">&nbsp;</td>';
		}
	}

	// カレンダー本体の作成
	for(var i=1; i<=enddate; i++) {
		myday = mydate.getDay();
		if(myday == s_day && i != 1) {
			html += '</tr><tr valign="middle">';
		}

		if(myday == firstday) week++;

		// 休日の確認
		holiday = bas_holiday[week][myday];
		
		if(jpn_holiday[arr] != undefined) {
			if(jQuery.inArray(i+"", jpn_holiday[arr]) > -1) holiday = "A";
		}
		if(exc_holiday[arr] != undefined) {
			if(jQuery.inArray(i+"", exc_holiday[arr]) > -1) holiday = sinryo;
		}
		if(inc_holiday[arr] != undefined) {
			if(jQuery.inArray(i+"", inc_holiday[arr]) > -1) holiday = "A";
		}

		//2016.06.29 add start
		//カスタム日程を表示する
		cst_arr = y + "-" + m + "-" + i
		if (cst_holiday[arr] != undefined) {
			//ラベルを取得
			if(cst_label[cst_arr]) {
				if(jQuery.inArray(i+"", cst_holiday[arr]) > -1) holiday = cst_label[cst_arr];
			}
		}
		//2016.06.29 add end
		
		//if(jpn_holiday[arr] != undefined) {
		//	if(jQuery.inArray(i+"", jpn_holiday[arr]) > -1) holiday = "A";
		//}

		// 本日の確認
		if(today) {
			if(i == now.getDate()) {
				today_class = ' today';
			} else {
				today_class = '';
			}
		}

		if(holiday.length > 0) {
			html += '<td class="' + holiday + today_class + '">' + i + '</td>';
		} else {
			html += '<td class="business' + today_class + '">' + i + '</td>';
		}

		mydate.setDate(mydate.getDate() + 1);

		// 末日以降のデータを埋める
		if(i == enddate) {
			while(mydate.getDay() != s_day) {
				html += '<td class="space">&nbsp;</td>';
				mydate.setDate(mydate.getDate() + 1);
			}
		}
	}
	
	//2018.10.18 change start カレンダー上テキストを可変
	//var holiday_ex = '<p class="calendar-information"><span class="holiday-color A">&nbsp;</span>休診日</p>';
	var holiday_txt = '';
	var holiday_ex = '';
	if($('.txt_a').val().length) {
		holiday_txt = $('.txt_a').val();
	} else {
		holiday_txt = "休診日";
	}
	holiday_ex += '<p class="calendar-information"><span class="holiday-color A">&nbsp;</span>' + holiday_txt + '</p>';
	//2018.10.18 change end
	if($('.txt_b').val().length) {
		holiday_txt = $('.txt_b').val();
		holiday_ex += '<p class="calendar-information"><span class="holiday-color B">&nbsp;</span>' + holiday_txt + '</p>';
	}
	if($('.txt_c').val().length) {
		holiday_txt = $('.txt_c').val();
		holiday_ex += '<p class="calendar-information"><span class="holiday-color C">&nbsp;</span>' + holiday_txt + '</p>';
	}
	if($('.txt_d').val().length) {
		holiday_txt = $('.txt_d').val();
		holiday_ex += '<p class="calendar-information"><span class="holiday-color D">&nbsp;</span>' + holiday_txt + '</p>';
	}
	if($('.txt_e').val().length) {
		holiday_txt = $('.txt_e').val();
		holiday_ex += '<p class="calendar-information"><span class="holiday-color E">&nbsp;</span>' + holiday_txt + '</p>';
	}
	if($('.txt_f').val().length) {
		holiday_txt = $('.txt_f').val();
		holiday_ex += '<p class="calendar-information"><span class="holiday-color F">&nbsp;</span>' + holiday_txt + '</p>';
	}

	html += '</tr></tbody></table>'
				+ '</td></tr>'
				+ '<tr><td colspan="3">'
				+ holiday_ex
				+ '</td></tr>';

	if (label_note && label_note.length > 0) {
		html += '<tr><td colspan="3">'
				+ '<p class="calendar-label-note">' + label_note.replace(/\n|&#13;&#10;/g, '<br/>') + '</p>'
				+ '</td></tr>';
	}

	html += '<tr><td colspan="3">'
				+ '<p class="return_now"><a href="javascript:void(0);" onclick="create_business_calendar( jQuery(this), ' + now.getFullYear() + ', ' + (now.getMonth() + 1) + ');">当月に戻る</a></p>'
				+ '<div style="clear: both;"></div></td></tr>'
				+ '</tbody></table>';

	jq.children(".isp-calendar-table").html(html);
	
	// リターン
	return true;
}
