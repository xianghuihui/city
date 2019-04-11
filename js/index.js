layui.use('laydate', function(){
  var laydate = layui.laydate;
  
  var newDay ;
  var newMonth ;
  
  $(function(){
		var date = new Date();
		var preDate = new Date(date.getTime() - 24*60*60*1000);
	    var seperator1 = "-";
	    var month = preDate.getMonth() + 1;
	    var strDate = preDate.getDate();
	    if (month >= 1 && month <= 9) {
	        month = "0" + month;
	    }
	    if (strDate >= 0 && strDate <= 9) {
	        strDate = "0" + strDate;
	    }
	    newDay = "2019-02-20"//preDate.getFullYear() + seperator1 + month + seperator1 + strDate;
	    //var monthdate = "2019-02"//preDate.getFullYear() + seperator1 + month;
	    $("#newDate").val(newDay);
	    newMonth = preDate.getFullYear() + seperator1 + month;
	    getday(newDay);
	    
	})
  
  laydate.render({
    elem: '#newDate',
    max:'new Date()',
		btns: ['now'],
    done: function(value){
	    getday(value);
	  }
  });
  
	var url = "http://192.168.1.168:6406/service/visitor/";

	$('.tab-menu li').click(function () {
	    $(this).removeClass('tab1').addClass('tab0').siblings().removeClass('tab0').addClass('tab1');
	    
		//$('.tab-top li').eq($(this).index()).addClass('active').siblings().removeClass('active');  tab按钮第二种写法
	    var index=$(this).index();
	    $(".tab-con .day").eq(index).show().siblings().hide();
	    if(index==0){
	    	getday(newDay);
	    	$("#newDate").remove();
	    	$(".form").html('<input type="text" class="layui-input" id="newDate" autocomplete="off" readonly unselectable="on">');
	    	//常规用法
			  laydate.render({
			    elem: '#newDate',
			    max:'new Date()',
			    value:new Date(),
			    btns: ['now'],
			    done: function(value){
				    getday(value);
				  }
			  });
	    }else{
	    	getmonth(newMonth);
	    	$("#newDate").remove();
	    	$(".form").html('<input type="text" class="layui-input" id="newDate" autocomplete="off" readonly unselectable="on">');
	    	laydate.render({
			    elem: '#newDate',
			    type: 'month',
    			value:new Date(),
			    max:'new Date()',
			    btns: ['confirm'],
			    done: function(value){
				    getmonth(value);
				  }
			  });
	    }
	})
	
	function getday(value){
		console.log(value)
		var data = {day : value};
		getallpersonnum(data,url+"day/num");
		getsexnum(data,url+"day/gendernum");
		getagenum(data,url+"day/agepartition");
		getareanum(data,url+"day/areanum");
	}
	
	function getmonth(value){
		console.log(value)
		var data = {month : value};
		getallpersonnum(data,url+"day/num");
		getmonthsexnum(data,url+"day/gendernum");
		getmonthagenum(data,url+"day/agepartition");
		getmonthareanum(data,url+"day/areanum");
	}

	function getallpersonnum(data,url){
		$(".spanday").text('');
		$.ajax({
			type:"get",
			url: url,
			data:data,
			success:function(res){
				console.log(res.num);
				$(".spanday").text(res.num);
			},
			error:function(){
				
			}
		});
	}

	//男女		日
	function getsexnum(data,url){
		myCharts1 = echarts.init(document.getElementById("pic1"));
		var option = {
		    tooltip : {
		        trigger: 'item',
		        formatter: "{b} : {c}人({d}%)"
		    },
		    color:['#7584CB','#64CBCC'],
		    legend: {
		        orient: 'vertical',
				x: 'left',
		        y:'center',
		        data:['男','女'],
		        textStyle: {
	                color:"white"
	            }
		    },
		    series: [
		        {
		            name:'',
		            type:'pie',
		            radius: ['55%', '70%'],
		            hoverAnimation:false,	//鼠标悬停
		            itemStyle : {
		                normal : {
		                    label : {
		                        show : true,
		                        formatter: "{c}({d}%)",//显示标签
		                    },
		                    labelLine : {
		                        show : true,//显示标签线
		                    },
		                },
		
		            },
		            data:[
		                {value:14, name:'男'},
		                {value:11, name:'女'}
		            ]
		        }
		    ]
		};
    $.ajax({
		type:"get",
		url: url,
		data:data,
		success:function(res){
			var jsonres = JSON.stringify(res);// 转成JSON格式
			var result = $.parseJSON(jsonres);// 转成JSON对象
			var sexAndnum = [{value:result.男, name:'男'},{value:result.女, name:'女'}];
            myCharts1.setOption({
                 series:[{ 
                     data:sexAndnum
                 }]
            });
		},
		error:function(){
			
		}
		});
	  myCharts1.setOption(option);
	}
	
	//年龄		日
	function getagenum(data,url){
		var myCharts2 = echarts.init(document.getElementById("pic2"));
		var option={
	        tooltip: {
	            trigger: 'axis',
	        },
	        legend:{
	        	icon : 'roundRect',
	        },
	        calculable: true,
	        xAxis: [{
	            axisLine: {
	                lineStyle: {
	                    color: '#9FA9CD'
	                }
	            },
	            type: 'category',
	            //boundaryGap: false,	//顶边
	            data: ["18岁以下","19-30岁","31-40岁","41-50岁","50岁以上"]
	        }],
	        yAxis: [{
	            type: 'value',
	            splitLine:{
	            	lineStyle:{
	                 color: ['#1C2D53'],
	            	}
	            },
	            axisLine: {
	                lineStyle: {
	                    color: '#9FA9CD'
	                }
	            }
	        }],
	        series: [{
	            name: '',
	            type: 'line',
	            itemStyle:{
	            	normal: {
	            		label: {
	            			show: true
	            		}
	            	}
	            },
	            //symbol: 'none',	//小圆点
	            smooth: 0.5,	//弧度 0-1
	            color: ['#66AEDE'],
	            data: [9,8,3,3,1],
	            areaStyle: {
	                normal: {
	                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ //折线图颜色渐变
	                        offset: 0,
	                        color: 'rgba(62,139,222,0.6)'
	                    }, {
	                        offset: 1,
	                        color: 'rgba(62,139,222,0.01)'
	                    }])
	                }
	            },
	        }]
		};
		$.ajax({
			type:"get",
			url: url,
			data:data,
			success:function(res){
				var jsonres = JSON.stringify(res);	//转为JSON格式
				var result = $.parseJSON(jsonres);	//转为JSON对象
				//console.log(result);
				var num = [result.less18,result["19to30"],result["31to40"],result["41to50"],result.greater50];
	            myCharts2.setOption({
	                 series:[{
	                 	data:num
	                 }]
	            });
			},
			error:function(){
				
			}
		});
	  myCharts2.setOption(option);
	}
	
	//分布		日
	function getareanum(data,url){
		var myCharts3 = echarts.init(document.getElementById("pic3"));
		var option = {
		    tooltip : {
		        trigger: 'item',
		        formatter: "{b}: {c}人"
		    },
	        calculable : false,
	        color:['#0064AD','#1CB7DB'],
		    series : [
		        {
		        	name:'',
		            type:'treemap',
		            roam:false,		//鼠标滚动放大缩小
		            clickable:false,
	                breadcrumb:{
	                    show: false
	                },
		            itemStyle: {
		                normal: {
		                    label: {
		                        show: true,
		                        formatter: "{b}({c}人次)",
		                    },
		                },
		                emphasis: {
		                    label: {
		                        show: true
		                    }
		                }
		            },
		            data:[
		            	{name:'影视部',value:650},{name:'大厅',value:84}
		            ]
		        }
		    ]
		};
		$.ajax({
			type:"get",
			url: url,
			data:data,
			success:function(res){
				var jsonres = JSON.stringify(res);	// 转成JSON格式
				var result = $.parseJSON(jsonres);	// 转成JSON对象
				var num = [{name:'影视部',value:result.影视部},{name:'大厅',value:result.大厅}];
	            myCharts3.setOption({
	                series : {
	                 	data:num,
	                }
	            });
			},
			error:function(){
				
			}
		});
	  myCharts3.setOption(option);
	}
	
	//男女		月
	function getmonthsexnum(data,url){
		myCharts4 = echarts.init(document.getElementById("pic4"));
		var option = {
		    tooltip : {
		        trigger: 'item',
		        formatter: "{b} : {c}人({d}%)"
		    },
		    color:['#7584CB','#64CBCC'],
		    legend: {
		        orient: 'vertical',
				x: 'left',
		        y:'center',
		        data:['男','女'],
		        textStyle: {
	                color:"white"
	            }
		    },
		    series: [
		        {
		            name:'',
		            type:'pie',
		            radius: ['55%', '70%'],
		            hoverAnimation:false,	//鼠标悬停
		            itemStyle : {
		                normal : {
		                    label : {
		                        show : true,
		                        formatter: "{c}({d}%)",//显示标签
		                    },
		                    labelLine : {
		                        show : true,//显示标签线
		                    },
		                },
		
		            },
		            data:[
		                {value:14, name:'男'},
		                {value:11, name:'女'}
		            ]
		        }
		    ]
		};
    $.ajax({
		type:"get",
		url: url,
		data:data,
		success:function(res){
			var jsonres = JSON.stringify(res);// 转成JSON格式
			var result = $.parseJSON(jsonres);// 转成JSON对象
			var sexAndnum = [{value:result.男, name:'男'},{value:result.女, name:'女'}];
            myCharts4.setOption({
                 series:[{ 
                     data:sexAndnum
                 }]
            });
		},
		error:function(){
			
		}
		});
	  myCharts4.setOption(option);
	}
	
	function getmonthagenum(data,url){
		var myCharts5 = echarts.init(document.getElementById("pic5"));
		var option={
	        tooltip: {
	            trigger: 'axis',
	        },
	        legend:{
	        	icon : 'roundRect',
	        },
	        calculable: true,
	        xAxis: [{
	            axisLine: {
	                lineStyle: {
	                    color: '#9FA9CD'
	                }
	            },
	            type: 'category',
	            //boundaryGap: false,	//顶边
	            data: ["18岁以下","19-30岁","31-40岁","41-50岁","50岁以上"]
	        }],
	        yAxis: [{
	            type: 'value',
	            splitLine:{
	            	lineStyle:{
	                 color: ['#1C2D53'],
	            	}
	            },
	            axisLine: {
	                lineStyle: {
	                    color: '#9FA9CD'
	                }
	            }
	        }],
	        series: [{
	            name: '',
	            type: 'line',
	            itemStyle:{
	            	normal: {
	            		label: {
	            			show: true
	            		}
	            	}
	            },
	            //symbol: 'none',	//小圆点
	            smooth: 0.5,	//弧度 0-1
	            color: ['#66AEDE'],
	            data: [9,8,3,3,1],
	            areaStyle: {
	                normal: {
	                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ //折线图颜色渐变
	                        offset: 0,
	                        color: 'rgba(62,139,222,0.6)'
	                    }, {
	                        offset: 1,
	                        color: 'rgba(62,139,222,0.01)'
	                    }])
	                }
	            },
	        }]
		};
		$.ajax({
			type:"get",
			url: url,
			data:data,
			success:function(res){
				var jsonres = JSON.stringify(res);	//转为JSON格式
				var result = $.parseJSON(jsonres);	//转为JSON对象
				//console.log(result);
				var num = [result.less18,result["19to30"],result["31to40"],result["41to50"],result.greater50];
	            myCharts5.setOption({
	                 series:[{
	                 	data:num
	                 }]
	            });
			},
			error:function(){
				
			}
		});
	  myCharts5.setOption(option);
	}
	
	function getmonthareanum(data,url){
		var myCharts6 = echarts.init(document.getElementById("pic6"));
		var option = {
		    tooltip : {
		        trigger: 'item',
		        formatter: "{b}: {c}人"
		    },
	        calculable : false,
	        color:['#0064AD','#1CB7DB'],
		    series : [
		        {
		        	name:'',
		            type:'treemap',
		            roam:false,		//鼠标滚动放大缩小
		            clickable:false,
	                breadcrumb:{
	                    show: false
	                },
		            itemStyle: {
		                normal: {
		                    label: {
		                        show: true,
		                        formatter: "{b}({c}人次)",
		                    },
		                },
		                emphasis: {
		                    label: {
		                        show: true
		                    }
		                }
		            },
		            data:[
		            	{name:'影视部',value:650},{name:'大厅',value:84}
		            ]
		        }
		    ]
		};
		$.ajax({
			type:"get",
			url: url,
			data:data,
			success:function(res){
				var jsonres = JSON.stringify(res);	// 转成JSON格式
				var result = $.parseJSON(jsonres);	// 转成JSON对象
				var num = [{name:'影视部',value:result.影视部},{name:'大厅',value:result.大厅}];
	            myCharts6.setOption({
	                series : {
	                 	data:num,
	                }
	            });
			},
			error:function(){
				
			}
		});
	  myCharts6.setOption(option);
	}
	
});