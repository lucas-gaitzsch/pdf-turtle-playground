export const templateBody = `
<!DOCTYPE html>

<html>

<head>
	<style>
		.unbold-heading {
			font-weight: normal;
		}
	</style>
</head>

<body class="pdf-turtle">
	<h3 class="unbold-heading">{{ .heading }}</h3>

	<div class="cards-wrapper">
		<div class="card" style="background-color: rgba(84,255,0,0.2)">
			<div class="card-head">Total sales</div>
			<div class="card-body">{{ .summary.totalSales }}</div>
		</div>
		<div class="card">
			<div class="card-head">Sales per week</div>
			<div class="card-body">{{ .summary.salesPerWeek }}</div>
		</div>
		<div class="card">
			<div class="card-head">Performance index</div>
			<div class="card-body">{{ .summary.performanceIndex }} %</div>
		</div>
		<div class="card">
			<div class="card-head">Sales volume last year</div>
			<div class="card-body">{{ .summary.salesVolume }} $</div>
		</div>
	</div>

	<div id="echart-container" style="margin: 5mm 0; width:100%; height:6cm;">
	</div>

	<img style="width:100%; height: 4cm; object-fit: cover; border-radius:5mm" src="https://images.unsplash.com/photo-1543286386-2e659306cd6c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"/>

	<table class="reduced" style="margin-top:3mm; font-size:10pt;">
		<tr>
			<th>Order No.</th>
			<th>Product Line</th>
			<th>Customer Name</th>
			<th>Country</th>
			<th>Ordered Quanitiy</th>
			<th>Price Each</th>
			<th>Status</th>
		</tr>

		{{range .sales}}
		<tr class="no-page-break-inside">
			<td class="nowrap right">{{ .orderNumber }}</td>
			<td>{{ .productLine }}</td>
			<td>{{ .customerName }}</td>
			<td>{{ .country }}</td>
			<td class="nowrap right">{{ .quantityOrdered }}</td>
			<td class="nowrap right">{{ .priceEach }} $</td>
			<td>{{ .status }}</td>
		</tr>
		{{end}}
	</table>

	<script src="https://cdn.jsdelivr.net/npm/echarts@5.3.3/dist/echarts.min.js"></script>
	<script>
		var eChart = echarts.init(document.getElementById('echart-container'), null, { renderer: 'svg' });
		var option = {
			animation: false,
			color: ['#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00'],
			grid: {
				top: '6mm',
				left: 0,
				right: 0,
				bottom: 0,
				containLabel: true,
			},
			xAxis: [
				{
					type: 'category',
					boundaryGap: false,
					data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
				}
			],
			yAxis: [ { type: 'value' } ],
			series: [
				{
					name: 'Line 1',
					type: 'line',
					stack: 'Total',
					smooth: true,
					lineStyle: {
						width: 0
					},
					showSymbol: false,
					areaStyle: {
						opacity: 0.8,
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: 'rgb(128, 255, 165)' },
							{ offset: 1, color: 'rgb(1, 191, 236)' },
						])
					},
					data: {{ marshal .chartData.line1 }} // injected JSON from model
				},
				{
					name: 'Line 2',
					type: 'line',
					stack: 'Total',
					smooth: true,
					lineStyle: {
						width: 0
					},
					showSymbol: false,
					areaStyle: {
						opacity: 0.8,
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: 'rgb(55, 162, 255)' },
							{ offset: 1, color: 'rgb(116, 21, 219)' },
						])
					},
					data: {{ marshal .chartData.line2 }} // injected JSON from model
				},
				{
					name: 'Line 3',
					type: 'line',
					stack: 'Total',
					smooth: true,
					lineStyle: {
						width: 0
					},
					showSymbol: false,
					areaStyle: {
						opacity: 0.8,
						color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
							{ offset: 0, color: 'rgb(255, 191, 0)' },
							{ offset: 1, color: 'rgb(224, 62, 76)' },
						])
					},
					data: {{ marshal .chartData.line3 }} // injected JSON from model 
				}
			]
		};
		eChart.setOption(option);
	</script>

</body>

</html>
`.trimStart()

export const templateHeader = `
<!DOCTYPE html>

<html>

<head>
  <style>
  .header-container {
    padding-top: 5mm;
    display: flex;
    align-items: center;
    gap: 4mm;
  }
  </style>
</head>

<div class="header-container">
<svg style="width:1cm; height:1cm;" viewBox="0 0 24 24">
  <path fill="currentColor"
    d="M5,19A1,1 0 0,0 6,20H18A1,1 0 0,0 19,19C19,18.79 18.93,18.59 18.82,18.43L13,8.35V4H11V8.35L5.18,18.43C5.07,18.59 5,18.79 5,19M6,22A3,3 0 0,1 3,19C3,18.4 3.18,17.84 3.5,17.37L9,7.81V6A1,1 0 0,1 8,5V4A2,2 0 0,1 10,2H14A2,2 0 0,1 16,4V5A1,1 0 0,1 15,6V7.81L20.5,17.37C20.82,17.84 21,18.4 21,19A3,3 0 0,1 18,22H6M13,16L14.34,14.66L16.27,18H7.73L10.39,13.39L13,16M12.5,12A0.5,0.5 0 0,1 13,12.5A0.5,0.5 0 0,1 12.5,13A0.5,0.5 0 0,1 12,12.5A0.5,0.5 0 0,1 12.5,12Z" />
</svg>
<h2>{{ .title }}</h2>

<div style="flex-grow: 1;"><!-- SPACER --></div>
<div style="height: 1.6cm; width: 1.6cm">
  {{barcodeQr "https://github.com/lucas-gaitzsch/pdf-turtle"}}
</div>
</div>

</html>
`.trimStart()

export const templateFooter = `
<!DOCTYPE html>

<html>
<body>
  <div class=\"default-footer\"><div><span class=\"pageNumber\"></span> of <span class=\"totalPages\"></span></div></div>
</body>
</html>
`.trimStart()

export const model = {
  title: "PdfTurtle _🐢_ TestReport",
  heading: "Sales Overview",
  chartData: {
    line1: [140, 232, 101, 264, 90, 340, 250],
    line2: [320, 132, 201, 334, 190, 130, 220],
    line3: [220, 302, 181, 234, 210, 290, 150],
  },
  summary: {
    totalSales: 32993,
    salesPerWeek: 82,
    performanceIndex: 5.132,
    salesVolume: 848932,
  },
  sales: [
    {
      orderNumber: 10107,
      quantityOrdered: 30,
      priceEach: 95.7,
      orderedLineNumber: 2,
      sales: 2871,
      orderDate: "2/24/2003 0:00",
      status: "Shipped",
      qtrId: 1,
      monthId: 2,
      yearId: 2003,
      productLine: "Motorcycles",
      MSRP: 95,
      productCode: "S10_1678",
      customerName: "Land of Toys Inc.",
      phone: 2125557818,
      addrLine1: "897 Long Airport Avenue",
      addrLine2: "",
      city: "NYC",
      state: "NY",
      postalCode: 10022,
      country: "USA",
      territory: "NA",
      contactLastName: "Yu",
      contactFirstName: "Kwai",
      dealSize: "Small",
    },
    {
      orderNumber: 10121,
      quantityOrdered: 34,
      priceEach: 81.35,
      orderedLineNumber: 5,
      sales: 2765.9,
      orderDate: "5/7/2003 0:00",
      status: "Shipped",
      qtrId: 2,
      monthId: 5,
      yearId: 2003,
      productLine: "Motorcycles",
      MSRP: 95,
      productCode: "S10_1678",
      customerName: "Reims Collectables",
      phone: "26.47.1555",
      addrLine1: "59 rue de l'Abbaye",
      addrLine2: "",
      city: "Reims",
      state: "",
      postalCode: 51100,
      country: "France",
      territory: "EMEA",
      contactLastName: "Henriot",
      contactFirstName: "Paul",
      dealSize: "Small",
    },
    {
      orderNumber: 10134,
      quantityOrdered: 41,
      priceEach: 94.74,
      orderedLineNumber: 2,
      sales: 3884.34,
      orderDate: "7/1/2003 0:00",
      status: "Shipped",
      qtrId: 3,
      monthId: 7,
      yearId: 2003,
      productLine: "Motorcycles",
      MSRP: 95,
      productCode: "S10_1678",
      customerName: "Lyon Souveniers",
      phone: "+33 1 46 62 7555",
      addrLine1: "27 rue du Colonel Pierre Avia",
      addrLine2: "",
      city: "Paris",
      state: "",
      postalCode: 75508,
      country: "France",
      territory: "EMEA",
      contactLastName: "Da Cunha",
      contactFirstName: "Daniel",
      dealSize: "Medium",
    },
    {
      orderNumber: 10145,
      quantityOrdered: 45,
      priceEach: 83.26,
      orderedLineNumber: 6,
      sales: 3746.7,
      orderDate: "8/25/2003 0:00",
      status: "Shipped",
      qtrId: 3,
      monthId: 8,
      yearId: 2003,
      productLine: "Motorcycles",
      MSRP: 95,
      productCode: "S10_1678",
      customerName: "Toys4GrownUps.com",
      phone: 6265557265,
      addrLine1: "78934 Hillside Dr.",
      addrLine2: "",
      city: "Pasadena",
      state: "CA",
      postalCode: 90003,
      country: "USA",
      territory: "NA",
      contactLastName: "Young",
      contactFirstName: "Julie",
      dealSize: "Medium",
    },
    {
      orderNumber: 10159,
      quantityOrdered: 49,
      priceEach: 100,
      orderedLineNumber: 14,
      sales: 5205.27,
      orderDate: "10/10/2003 0:00",
      status: "Shipped",
      qtrId: 4,
      monthId: 10,
      yearId: 2003,
      productLine: "Motorcycles",
      MSRP: 95,
      productCode: "S10_1678",
      customerName: "Corporate Gift Ideas Co.",
      phone: 6505551386,
      addrLine1: "7734 Strong St.",
      addrLine2: "",
      city: "San Francisco",
      state: "CA",
      postalCode: "",
      country: "USA",
      territory: "NA",
      contactLastName: "Brown",
      contactFirstName: "Julie",
      dealSize: "Medium",
    },
    {
      orderNumber: 10168,
      quantityOrdered: 36,
      priceEach: 96.66,
      orderedLineNumber: 1,
      sales: 3479.76,
      orderDate: "10/28/2003 0:00",
      status: "Shipped",
      qtrId: 4,
      monthId: 10,
      yearId: 2003,
      productLine: "Motorcycles",
      MSRP: 95,
      productCode: "S10_1678",
      customerName: "Technics Stores Inc.",
      phone: 6505556809,
      addrLine1: "9408 Furth Circle",
      addrLine2: "",
      city: "Burlingame",
      state: "CA",
      postalCode: 94217,
      country: "USA",
      territory: "NA",
      contactLastName: "Hirano",
      contactFirstName: "Juri",
      dealSize: "Medium",
    },
    {
      orderNumber: 10180,
      quantityOrdered: 29,
      priceEach: 86.13,
      orderedLineNumber: 9,
      sales: 2497.77,
      orderDate: "11/11/2003 0:00",
      status: "Shipped",
      qtrId: 4,
      monthId: 11,
      yearId: 2003,
      productLine: "Motorcycles",
      MSRP: 95,
      productCode: "S10_1678",
      customerName: "Daedalus Designs Imports",
      phone: "20.16.1555",
      addrLine1: "184, chausse de Tournai",
      addrLine2: "",
      city: "Lille",
      state: "",
      postalCode: 59000,
      country: "France",
      territory: "EMEA",
      contactLastName: "Rance",
      contactFirstName: "Martine",
      dealSize: "Small",
    },
    {
      orderNumber: 10188,
      quantityOrdered: 48,
      priceEach: 100,
      orderedLineNumber: 1,
      sales: 5512.32,
      orderDate: "11/18/2003 0:00",
      status: "Shipped",
      qtrId: 4,
      monthId: 11,
      yearId: 2003,
      productLine: "Motorcycles",
      MSRP: 95,
      productCode: "S10_1678",
      customerName: "Herkku Gifts",
      phone: "+47 2267 3215",
      addrLine1: "Drammen 121, PR 744 Sentrum",
      addrLine2: "",
      city: "Bergen",
      state: "",
      postalCode: "N 5804",
      country: "Norway",
      territory: "EMEA",
      contactLastName: "Oeztan",
      contactFirstName: "Veysel",
      dealSize: "Medium",
    },
    {
      orderNumber: 10201,
      quantityOrdered: 22,
      priceEach: 98.57,
      orderedLineNumber: 2,
      sales: 2168.54,
      orderDate: "12/1/2003 0:00",
      status: "Shipped",
      qtrId: 4,
      monthId: 12,
      yearId: 2003,
      productLine: "Motorcycles",
      MSRP: 95,
      productCode: "S10_1678",
      customerName: "Mini Wheels Co.",
      phone: 6505555787,
      addrLine1: "5557 North Pendale Street",
      addrLine2: "",
      city: "San Francisco",
      state: "CA",
      postalCode: "",
      country: "USA",
      territory: "NA",
      contactLastName: "Murphy",
      contactFirstName: "Julie",
      dealSize: "Small",
    },
    {
      orderNumber: 10211,
      quantityOrdered: 41,
      priceEach: 100,
      orderedLineNumber: 14,
      sales: 4708.44,
      orderDate: "1/15/2004 0:00",
      status: "Shipped",
      qtrId: 1,
      monthId: 1,
      yearId: 2004,
      productLine: "Motorcycles",
      MSRP: 95,
      productCode: "S10_1678",
      customerName: "Auto Canal Petit",
      phone: "(1) 47.55.6555",
      addrLine1: "25, rue Lauriston",
      addrLine2: "",
      city: "Paris",
      state: "",
      postalCode: 75016,
      country: "France",
      territory: "EMEA",
      contactLastName: "Perrier",
      contactFirstName: "Dominique",
      dealSize: "Medium",
    },
    {
      orderNumber: 10223,
      quantityOrdered: 37,
      priceEach: 100,
      orderedLineNumber: 1,
      sales: 3965.66,
      orderDate: "2/20/2004 0:00",
      status: "Shipped",
      qtrId: 1,
      monthId: 2,
      yearId: 2004,
      productLine: "Motorcycles",
      MSRP: 95,
      productCode: "S10_1678",
      customerName: "Australian Collectors, Co.",
      phone: "03 9520 4555",
      addrLine1: "636 St Kilda Road",
      addrLine2: "Level 3",
      city: "Melbourne",
      state: "Victoria",
      postalCode: 3004,
      country: "Australia",
      territory: "APAC",
      contactLastName: "Ferguson",
      contactFirstName: "Peter",
      dealSize: "Medium",
    },
    {
      orderNumber: 10237,
      quantityOrdered: 23,
      priceEach: 100,
      orderedLineNumber: 7,
      sales: 2333.12,
      orderDate: "4/5/2004 0:00",
      status: "Shipped",
      qtrId: 2,
      monthId: 4,
      yearId: 2004,
      productLine: "Motorcycles",
      MSRP: 95,
      productCode: "S10_1678",
      customerName: "Vitachrome Inc.",
      phone: 2125551500,
      addrLine1: "2678 Kingston Rd.",
      addrLine2: "Suite 101",
      city: "NYC",
      state: "NY",
      postalCode: 10022,
      country: "USA",
      territory: "NA",
      contactLastName: "Frick",
      contactFirstName: "Michael",
      dealSize: "Small",
    },
    {
      orderNumber: 10251,
      quantityOrdered: 28,
      priceEach: 100,
      orderedLineNumber: 2,
      sales: 3188.64,
      orderDate: "5/18/2004 0:00",
      status: "Shipped",
      qtrId: 2,
      monthId: 5,
      yearId: 2004,
      productLine: "Motorcycles",
      MSRP: 95,
      productCode: "S10_1678",
      customerName: "Tekni Collectables Inc.",
      phone: 2015559350,
      addrLine1: "7476 Moss Rd.",
      addrLine2: "",
      city: "Newark",
      state: "NJ",
      postalCode: 94019,
      country: "USA",
      territory: "NA",
      contactLastName: "Brown",
      contactFirstName: "William",
      dealSize: "Medium",
    },
    {
      orderNumber: 10263,
      quantityOrdered: 34,
      priceEach: 100,
      orderedLineNumber: 2,
      sales: 3676.76,
      orderDate: "6/28/2004 0:00",
      status: "Shipped",
      qtrId: 2,
      monthId: 6,
      yearId: 2004,
      productLine: "Motorcycles",
      MSRP: 95,
      productCode: "S10_1678",
      customerName: "Gift Depot Inc.",
      phone: 2035552570,
      addrLine1: "25593 South Bay Ln.",
      addrLine2: "",
      city: "Bridgewater",
      state: "CT",
      postalCode: 97562,
      country: "USA",
      territory: "NA",
      contactLastName: "King",
      contactFirstName: "Julie",
      dealSize: "Medium",
    },
    {
      orderNumber: 10275,
      quantityOrdered: 45,
      priceEach: 92.83,
      orderedLineNumber: 1,
      sales: 4177.35,
      orderDate: "7/23/2004 0:00",
      status: "Shipped",
      qtrId: 3,
      monthId: 7,
      yearId: 2004,
      productLine: "Motorcycles",
      MSRP: 95,
      productCode: "S10_1678",
      customerName: "La Rochelle Gifts",
      phone: "40.67.8555",
      addrLine1: "67, rue des Cinquante Otages",
      addrLine2: "",
      city: "Nantes",
      state: "",
      postalCode: 44000,
      country: "France",
      territory: "EMEA",
      contactLastName: "Labrune",
      contactFirstName: "Janine",
      dealSize: "Medium",
    },
    {
      orderNumber: 10285,
      quantityOrdered: 36,
      priceEach: 100,
      orderedLineNumber: 6,
      sales: 4099.68,
      orderDate: "8/27/2004 0:00",
      status: "Shipped",
      qtrId: 3,
      monthId: 8,
      yearId: 2004,
      productLine: "Motorcycles",
      MSRP: 95,
      productCode: "S10_1678",
      customerName: "Marta's Replicas Co.",
      phone: 6175558555,
      addrLine1: "39323 Spinnaker Dr.",
      addrLine2: "",
      city: "Cambridge",
      state: "MA",
      postalCode: 51247,
      country: "USA",
      territory: "NA",
      contactLastName: "Hernandez",
      contactFirstName: "Marta",
      dealSize: "Medium",
    },
    {
      orderNumber: 10299,
      quantityOrdered: 23,
      priceEach: 100,
      orderedLineNumber: 9,
      sales: 2597.39,
      orderDate: "9/30/2004 0:00",
      status: "Shipped",
      qtrId: 3,
      monthId: 9,
      yearId: 2004,
      productLine: "Motorcycles",
      MSRP: 95,
      productCode: "S10_1678",
      customerName: "Toys of Finland, Co.",
      phone: "90-224 8555",
      addrLine1: "Keskuskatu 45",
      addrLine2: "",
      city: "Helsinki",
      state: "",
      postalCode: 21240,
      country: "Finland",
      territory: "EMEA",
      contactLastName: "Karttunen",
      contactFirstName: "Matti",
      dealSize: "Small",
    },
    {
      orderNumber: 10309,
      quantityOrdered: 41,
      priceEach: 100,
      orderedLineNumber: 5,
      sales: 4394.38,
      orderDate: "10/15/2004 0:00",
      status: "Shipped",
      qtrId: 4,
      monthId: 10,
      yearId: 2004,
      productLine: "Motorcycles",
      MSRP: 95,
      productCode: "S10_1678",
      customerName: "Baane Mini Imports",
      phone: "07-98 9555",
      addrLine1: "Erling Skakkes gate 78",
      addrLine2: "",
      city: "Stavern",
      state: "",
      postalCode: 4110,
      country: "Norway",
      territory: "EMEA",
      contactLastName: "Bergulfsen",
      contactFirstName: "Jonas",
      dealSize: "Medium",
    },
    {
      orderNumber: 10318,
      quantityOrdered: 46,
      priceEach: 94.74,
      orderedLineNumber: 1,
      sales: 4358.04,
      orderDate: "11/2/2004 0:00",
      status: "Shipped",
      qtrId: 4,
      monthId: 11,
      yearId: 2004,
      productLine: "Motorcycles",
      MSRP: 95,
      productCode: "S10_1678",
      customerName: "Diecast Classics Inc.",
      phone: 2155551555,
      addrLine1: "7586 Pompton St.",
      addrLine2: "",
      city: "Allentown",
      state: "PA",
      postalCode: 70267,
      country: "USA",
      territory: "NA",
      contactLastName: "Yu",
      contactFirstName: "Kyung",
      dealSize: "Medium",
    },
    {
      orderNumber: 10329,
      quantityOrdered: 42,
      priceEach: 100,
      orderedLineNumber: 1,
      sales: 4396.14,
      orderDate: "11/15/2004 0:00",
      status: "Shipped",
      qtrId: 4,
      monthId: 11,
      yearId: 2004,
      productLine: "Motorcycles",
      MSRP: 95,
      productCode: "S10_1678",
      customerName: "Land of Toys Inc.",
      phone: 2125557818,
      addrLine1: "897 Long Airport Avenue",
      addrLine2: "",
      city: "NYC",
      state: "NY",
      postalCode: 10022,
      country: "USA",
      territory: "NA",
      contactLastName: "Yu",
      contactFirstName: "Kwai",
      dealSize: "Medium",
    },
  ],
}
