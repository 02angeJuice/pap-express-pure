import {createInstance} from 'i18next'
import {initReactI18next} from 'react-i18next'

const i18n = createInstance({
  compatibilityJSON: 'v3',
  fallbackLng: 'gb',
  debug: false,

  interpolation: {
    escapeValue: false // not needed for react as it escapes by default
  },

  resources: {
    th: {
      translation: {
        version: 'อัปเดตเวอร์ชัน',
        version_detail: 'ดาวน์โหลดเวอร์ชันใหม่เพื่อใช้งานเวอร์ชันล่าสุด.',

        auth_login_invalid: 'เข้าสู่ระบบไม่สำเร็จ',
        auth_login_invalid_detail: 'ตรวจสอบรหัสผู้ใช้ หรือ รหัสผ่าน',
        auth_login_invalid_username:
          'กรุณาใส่รหัสผู้ใช้ รหัสผู้ใช้ไม่ควรเว้นว่าง',
        auth_login_invalid_password: 'กรุณาใส่รหัสผ่าน รหัสผ่านไม่ควรเว้นว่าง',
        auth_login_limit: 'ผู้ใช้งานเต็ม',
        auth_login_limit_detail: 'จำนวนผู้ใช้งานถึงขีดจำกัดแล้ว',
        auth_login_online: 'มีผู้ใช้งานอยู่ในขณะนี้',
        auth_login_online_detail: 'ทำการเข้าสู้ระบบหรือไม่ ?',
        auth_login_success: 'เข้าสู่ระบบ',
        auth_login_success_detail: 'เข้าสู่ระบบสำเร็จ!',
        auth_access_denied: 'ปฏิเสธการเข้าใช้',
        auth_access_denied_detail: 'กรุณาเข้าสู่ระบบใหม่อีกครั้ง',

        load_invalid: 'โหลดสินค้าไม่ถูกต้อง!',
        load_invalid_detail: 'กรุณาตรวจสอบสถานะของรายการสินค้า',
        load_shipment: 'เลือกการขนส่ง...!',
        load_shipment_detail: 'กรุณาเลือกประเภทการขนส่ง',
        load_alert: 'แจ้งเตือนการขนส่ง...!',
        load_alert_detail: 'การขนส่งได้รับการเปลี่ยนแปลง',

        barcode_invalid: 'บาร์โค้ดไม่ถูกต้อง',
        barcode_invalid_detail: 'บาร์โค้ดที่ป้อนไม่ถูกต้องสำหรับรายการนี้',

        signature_required: 'ลายเซ็นต์จำเป็นต้องมี...!',
        signature_required_detail: 'กรุณากรอกลายเซ็นต์ของคุณ',

        text_required: 'ข้อความต้องระบุ...!',
        text_required_detail: 'โปรดระบุข้อความสำหรับการยืนยันแบบบังคับ.',

        container_required: 'เลขตู้ไม่ถูกต้อง',
        container_required_detail: 'โปรดระบุเลขตู้ที่ถูกต้อง',

        write_message: 'พิมพ์ข้อความ...',
        enter_container: 'กรอกหมายเลขตู้',

        enter_barcode_title: 'ป้อนบาร์โค้ดด้วยตนเอง',
        enter_barcode_box: 'กรอกหมายเลขกล่อง',

        home: 'หน้าแรก',
        info: 'ข้อมูลทั่วไป',
        confirm: 'ยืนยัน',
        force_confirm: 'บังคับยืนยัน',
        confirmed: 'ยืนยันสำเร็จ',
        cancel: 'ยกเลิก',
        success: 'ยืนยันแล้ว',
        waiting: 'รออนุมัติ',
        code: 'รหัส',
        date: 'วันที่',
        name: 'ชื่อ',
        email: 'อีเมล',
        status: 'สถานะ',
        paginationLabel: 'แถวต่อหน้า',
        weight: 'ชั่งวัด',
        receipt: 'เอกสาร',
        clear: 'ล้างข้อมูล',
        close: 'ปิด',
        load_to_truck: 'โหลดสินค้าขึ้นตู้',
        unload_from_truck: 'โหลดสินค้าลงตู้',
        distribution: 'จ่ายออกสินค้า',
        scan_receive: 'สแกนรับสินค้า',
        personal_info: 'ข้อมูลส่วนตัว',
        help: 'ศูนย์ความช่วยเหลือ',
        setting: 'การตั้งค่า',
        logout: 'ออกจากระบบ',
        login: 'เข้าสู่ระบบ',
        username: 'รหัสผู้ใช้',
        password: 'รหัสผ่าน',
        photo: 'รูปภาพ',
        camera: 'กล้อง',
        camera_back: 'กลับ',
        camera_retake: 'เอาใหม่',
        camera_save: 'บันทึก',

        signature: 'ลายเซ็นต์',
        signature_support: 'ฟังก์ชั่นนี้ไม่ซัพพอร์ตบนเว็บเบราเซอร์',

        item_no: 'รหัสสินค้า',
        item_name: 'ชื่อสินค้า',
        item_list: 'รายการสินค้า',
        item_detail: 'รายละเอียดสินค้า',
        item_container: 'ยืนยันตู้คอนเทนเนอร์',
        receipt_no: 'เลขที่เอกสาร',
        transport_type: 'ประเภทการขนส่ง',
        transport_select: 'เลือกการขนส่ง',
        container_no: 'เลขตู้',
        date_departure: 'วันที่ออกเดินทาง',
        date_arrival: 'วันที่มาถึง',
        car: 'รถ',
        ship: 'เรือ',
        change: 'เปลี่ยนแปลง',
        enter_barcode: 'สแกน บาร์โค้ด...',
        box: 'ลัง',
        box_amount: 'จำนวนสินค้า',
        box_amount_actual: 'จำนวนสินค้าที่ส่งจริง',
        box_piece: 'ชิ้น',
        total_weight: 'น้ำหนักรวม',

        annotations: 'หมายเหตุ',
        instructions: 'คำแนะนำในการจัดส่ง',
        empty: 'ไม่มีรายการ',
        customer: 'ลูกค้า',
        recipient: 'ผู้รับ',
        phone: 'เบอร์โทรศัพท์',
        driver: 'คนขับรถ',
        car_regis: 'ทะเบียนรถ',
        tracking_no: 'เลขแท็กจากจีน',
        tracking_four: 'เลขที่สินค้า （4 ตัว）',
        width: 'ขนาดกว้าง',
        length: 'ขนาดยาว',
        height: 'ขนาดสูง',

        od_waiting: 'รอยืนยัน',
        od_confirm: 'ยืนยันแล้ว',
        od_item_empty: 'ไม่มีรายการสินค้าที่ทำการยืนยัน',
        od_item_confirmed: 'รายการสินค้าทำการยืนยันครบหมดแล้ว',
        od_type_warehouse: 'รับสินค้าที่คลัง',
        od_type_express: 'บริการขนส่งเอกชน',
        od_type_self: 'บริษัทจัดส่งเอง'
      }
    },
    gb: {
      translation: {
        version: 'Update version',
        version_detail: 'Download the new version for up to date.',

        auth_login_invalid: 'Login Failed',
        auth_login_invalid_detail: 'Please check your username or password',
        auth_login_invalid_username:
          'Please enter a username. Username should not be empty',
        auth_login_invalid_password:
          'Please enter a password. Password should not be empty',
        auth_login_limit: 'User Limit Exceeded',
        auth_login_limit_detail: 'The number of users has reached the limit',
        auth_login_online: 'Users are currently online',
        auth_login_online_detail: 'Are you trying to log in?',
        auth_login_success: 'Logged In',
        auth_login_success_detail: 'Logged in successfully!',
        auth_access_denied: 'Access Denied',
        auth_access_denied_detail: 'Please log in again',

        load_invalid: 'Truck Load incorrectly!',
        load_invalid_detail: `Please check the item's status.`,
        load_shipment: 'Load shipment required...!',
        load_shipment_detail: 'Please select the shipment type.',
        load_alert: 'Shipment Alert...!',
        load_alert_detail: 'Transportation has been changed.',

        barcode_invalid: 'Invalid Barcode',
        barcode_invalid_detail:
          'The entered barcode is not valid for the current item.',

        signature_required: 'Signature must be required...!',
        signature_required_detail: 'Please fill your signature.',

        text_required: 'Text must be required...!',
        text_required_detail: 'Please specify a message for force confirm.',

        container_required: 'Invalid container number',
        container_required_detail: 'Please provide a valid container number',

        write_message: 'Write a message...',
        enter_container: 'Enter container number',

        enter_barcode_title: 'Barcode Manually',
        enter_barcode_box: 'Enter box number',

        home: 'Home',
        info: 'Information',
        confirm: 'Confirm',
        force_confirm: 'Force Confirm',
        confirmed: 'Confirmed Successfully',
        cancel: 'Cancel',
        success: 'Success',
        waiting: 'Waiting',
        code: 'UserId',
        date: 'Date',
        name: 'Username',
        email: 'Email',
        status: 'Status',
        paginationLabel: 'Rows per page',
        weight: 'weighting',
        receipt: 'Receipt',
        clear: 'Clear',
        close: 'Close',
        load_to_truck: 'Load To Truck',
        unload_from_truck: 'Unload From Truck',
        distribution: 'Distribution',
        scan_receive: 'Scan Receive',
        personal_info: 'Personal Information',
        help: 'Help',
        setting: 'Settings',
        logout: 'Logout',
        login: 'Login',
        username: 'Username',
        password: 'Password',
        photo: 'Photo',
        camera: 'Camera',
        camera_back: 'Back',
        camera_retake: 'Retake',
        camera_save: 'Save',

        signature: 'Signature',
        signature_support: 'This function support on mobile devices only.',

        item_no: 'Product Code',
        item_name: 'Product',
        item_list: 'Product List',
        item_detail: 'Product Details',
        item_container: 'Confirm Container',
        receipt_no: 'Receipt Code',
        transport_type: 'Transport Type',
        transport_select: 'Select Transportation',
        container_no: 'Container No',
        date_departure: 'Departure Date',
        date_arrival: 'Arrival Date',
        car: 'Car',
        ship: 'Ship',
        change: 'Changed',
        enter_barcode: 'Enter barcode...',
        box: 'Box',
        box_amount: 'Quantity',
        box_amount_actual: 'Actual Quantity',
        box_piece: 'Pcs',
        total_weight: 'Total weight',

        annotations: 'Annotations',
        instructions: 'Shipping Instructions',
        empty: 'There are no items.',
        customer: 'Customer',
        recipient: 'Recipient',
        phone: 'Phone number',
        driver: 'Driver',
        car_regis: 'Vehicle Registration',
        tracking_no: 'Tracking No',
        tracking_four: 'Tracking （Four）',
        width: 'Width',
        length: 'Length',
        height: 'Height',

        od_waiting: 'Waiting',
        od_confirm: 'Confirmed',
        od_item_empty: 'There are no confirmed products listed.',
        od_item_confirmed: 'The product list has been completely verified.',
        od_type_warehouse: 'Receive Warehouse',
        od_type_express: 'Delivery Service',
        od_type_self: 'By Company'
      }
    },
    cn: {
      translation: {
        version: '更新版本',
        version_detail: '下载最新版本以保持更新。',

        auth_login_invalid: '登录失败',
        auth_login_invalid_detail: '请检查您的用户名或密码',
        auth_login_invalid_username: '请输入用户名。用户名不能为空',
        auth_login_invalid_password: '请输入密码。密码不能为空',
        auth_login_limit: '用户达到限制',
        auth_login_limit_detail: '用户数量已达到限制',
        auth_login_online: '当前有用户在线',
        auth_login_online_detail: '您是否要尝试登录？',
        auth_login_success: '登录成功',
        auth_login_success_detail: '登录成功！',
        auth_access_denied: '拒绝访问',
        auth_access_denied_detail: '请重新登录',

        load_invalid: '卡车装载不正确！',
        load_invalid_detail: '请检查货物的状态。',
        load_shipment: '需要装载货物...！',
        load_shipment_detail: '请选择装载的货物类型。',
        load_alert: '运输警报...!',
        load_alert_detail: '运输方式已更改',

        barcode_invalid: '无效条码',
        barcode_invalid_detail: '输入的条码对当前物品无效。',

        signature_required: '必须要求签名...!',
        signature_required_detail: '请填写您的签名',

        text_required: '必须填写文字...!',
        text_required_detail: '请为强制确认指定一条消息。',

        container_required: '货柜号码无效',
        container_required_detail: '请提供有效的货柜号码',

        write_message: '写消息...',
        enter_container: '输入集装箱编号',

        enter_barcode_title: '手动输入条形码',
        enter_barcode_box: '输入盒子编号',

        home: '首页',
        info: '信息',
        confirm: '确认',
        force_confirm: '强制确认',
        confirmed: '确认成功',

        cancel: '取消',
        success: '成功',
        waiting: '等待',
        code: '编号',
        date: '日期',
        name: '用户名',
        email: '电子邮件',
        status: '状态',
        paginationLabel: '每页行数',
        weight: '称重',
        receipt: '文档',
        clear: '取消',
        close: '关闭',
        load_to_truck: '装柜',
        unload_from_truck: '到达',
        distribution: '产品分销',
        scan_receive: '扫描领取产品',
        personal_info: '个人信息',
        help: '帮助中心',
        setting: '设置',
        logout: '登出',
        login: '登录',
        username: '用户名',
        password: '密码',
        photo: '照片',
        camera: '相机',
        camera_back: '后退',
        camera_retake: '相重拍',
        camera_save: '节省',

        signature: '签名',
        signature_support: '此功能仅支持移动设备',

        item_no: '产品代码',
        item_name: '产品名称',
        item_list: '产品列表',
        item_detail: '产品信息',
        item_container: '确认容器',
        receipt_no: '收据代码',
        transport_type: '运输类型',
        transport_select: '选择交通',
        container_no: '集装箱',
        date_departure: '出发日期',
        date_arrival: '到达日期',
        car: '陆运',
        ship: '船运',
        change: '改变了',
        enter_barcode: '输入条形码...',
        box: '箱',
        box_amount: '数量/箱',
        box_amount_actual: '实际产品数量',
        box_piece: '件',
        total_weight: '总重量',

        annotations: '注释',
        instructions: '运输说明',
        empty: '没有物品.',
        customer: '客户ID',
        recipient: '接受者',
        phone: '电话号码',
        driver: '司机',
        car_regis: '车辆登记',
        tracking_no: '运单号',
        tracking_four: '收货单号 （订单号）',
        width: '宽度',
        length: '长度',
        height: '高度',

        od_waiting: '等待确认中',
        od_confirm: '确认的',
        od_item_empty: '没有列出已确认的产品。',
        od_item_confirmed: '产品清单已完全核实。',
        od_type_warehouse: '收货仓库',
        od_type_express: '快递服务',
        od_type_self: '按公司分类'
      }
    }
  }
})

i18n.use(initReactI18next).init()

export default i18n
