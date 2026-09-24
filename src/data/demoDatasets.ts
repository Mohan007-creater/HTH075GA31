/**
 * Demo Datasets with intentionally contrasting, schema-agnostic column names.
 *
 * Dataset 1: Hardware Enterprise Tech (Hardware_SKU, Units_Shipped, Billed_Amount, Ship_Date, Territory, Discount_Pct, Client_Tier)
 * Dataset 2: Urban Fresh Supermarket PoS (Grocery_Item, Department, Volume_Kg, Line_Total, Store_Branch, Purchase_Timestamp, Cashier_Code, Payment_Method)
 * Dataset 3: Cloud SaaS Metrics (Subscription_Key, Plan_Name, Active_Seats, Monthly_Recurring_Fee, Billing_Cycle, Renewal_Date, Account_Region, Usage_Band)
 */

export interface DemoDatasetDefinition {
  id: string;
  name: string;
  fileName: string;
  description: string;
  tag: string;
  records: Record<string, any>[];
}

export const DEMO_DATASETS: DemoDatasetDefinition[] = [
  {
    id: 'demo-hardware-retail',
    name: 'Global Tech Hardware Logistics',
    fileName: 'tech_hardware_logistics_2026.csv',
    tag: 'Enterprise Hardware',
    description: 'Hardware shipments with SKU codes, billed amounts, shipping dates, discount percentages, and territory codes.',
    records: [
      { Invoice_ID: 'INV-1001', Hardware_SKU: 'ThinkStation P620', Item_Family: 'Workstation', Units_Shipped: 14, Billed_Amount: 46200, Discount_Pct: 5, Ship_Date: '2025-01-12', Territory: 'North America', Client_Tier: 'Enterprise' },
      { Invoice_ID: 'INV-1002', Hardware_SKU: 'BladePro X16', Item_Family: 'Laptop', Units_Shipped: 42, Billed_Amount: 96600, Discount_Pct: 8, Ship_Date: '2025-01-18', Territory: 'EMEA', Client_Tier: 'Enterprise' },
      { Invoice_ID: 'INV-1003', Hardware_SKU: 'TensorNode A100', Item_Family: 'Server Rack', Units_Shipped: 6, Billed_Amount: 180000, Discount_Pct: 2, Ship_Date: '2025-01-24', Territory: 'North America', Client_Tier: 'Government' },
      { Invoice_ID: 'INV-1004', Hardware_SKU: 'UltraView 34C', Item_Family: 'Display', Units_Shipped: 75, Billed_Amount: 52500, Discount_Pct: 10, Ship_Date: '2025-02-02', Territory: 'APAC', Client_Tier: 'Commercial' },
      { Invoice_ID: 'INV-1005', Hardware_SKU: 'EdgeCompute Micro', Item_Family: 'IoT Gateway', Units_Shipped: 120, Billed_Amount: 38400, Discount_Pct: 4, Ship_Date: '2025-02-14', Territory: 'LATAM', Client_Tier: 'SMB' },
      { Invoice_ID: 'INV-1006', Hardware_SKU: 'BladePro X16', Item_Family: 'Laptop', Units_Shipped: 35, Billed_Amount: 80500, Discount_Pct: 6, Ship_Date: '2025-02-22', Territory: 'North America', Client_Tier: 'Enterprise' },
      { Invoice_ID: 'INV-1007', Hardware_SKU: 'TensorNode A100', Item_Family: 'Server Rack', Units_Shipped: 8, Billed_Amount: 240000, Discount_Pct: 0, Ship_Date: '2025-03-05', Territory: 'EMEA', Client_Tier: 'Enterprise' },
      { Invoice_ID: 'INV-1008', Hardware_SKU: 'ThinkStation P620', Item_Family: 'Workstation', Units_Shipped: 22, Billed_Amount: 72600, Discount_Pct: 5, Ship_Date: '2025-03-12', Territory: 'APAC', Client_Tier: 'Commercial' },
      { Invoice_ID: 'INV-1009', Hardware_SKU: 'CyberShield Firewall 10G', Item_Family: 'Networking', Units_Shipped: 18, Billed_Amount: 43200, Discount_Pct: 7, Ship_Date: '2025-03-19', Territory: 'EMEA', Client_Tier: 'Commercial' },
      { Invoice_ID: 'INV-1010', Hardware_SKU: 'UltraView 34C', Item_Family: 'Display', Units_Shipped: 90, Billed_Amount: 63000, Discount_Pct: 12, Ship_Date: '2025-03-29', Territory: 'North America', Client_Tier: 'Commercial' },
      { Invoice_ID: 'INV-1011', Hardware_SKU: 'BladePro X16', Item_Family: 'Laptop', Units_Shipped: 50, Billed_Amount: 115000, Discount_Pct: 10, Ship_Date: '2025-04-03', Territory: 'APAC', Client_Tier: 'Enterprise' },
      { Invoice_ID: 'INV-1012', Hardware_SKU: 'EdgeCompute Micro', Item_Family: 'IoT Gateway', Units_Shipped: 180, Billed_Amount: 57600, Discount_Pct: 5, Ship_Date: '2025-04-16', Territory: 'North America', Client_Tier: 'SMB' },
      { Invoice_ID: 'INV-1013', Hardware_SKU: 'TensorNode A100', Item_Family: 'Server Rack', Units_Shipped: 12, Billed_Amount: 360000, Discount_Pct: 3, Ship_Date: '2025-04-28', Territory: 'North America', Client_Tier: 'Enterprise' },
      { Invoice_ID: 'INV-1014', Hardware_SKU: 'ThinkStation P620', Item_Family: 'Workstation', Units_Shipped: 30, Billed_Amount: 99000, Discount_Pct: 8, Ship_Date: '2025-05-10', Territory: 'LATAM', Client_Tier: 'Commercial' },
      { Invoice_ID: 'INV-1015', Hardware_SKU: 'UltraView 34C', Item_Family: 'Display', Units_Shipped: 60, Billed_Amount: 42000, Discount_Pct: 4, Ship_Date: '2025-05-22', Territory: 'EMEA', Client_Tier: 'SMB' },
      { Invoice_ID: 'INV-1016', Hardware_SKU: 'CyberShield Firewall 10G', Item_Family: 'Networking', Units_Shipped: 25, Billed_Amount: 60000, Discount_Pct: 5, Ship_Date: '2025-06-04', Territory: 'APAC', Client_Tier: 'Enterprise' },
      { Invoice_ID: 'INV-1017', Hardware_SKU: 'BladePro X16', Item_Family: 'Laptop', Units_Shipped: 65, Billed_Amount: 149500, Discount_Pct: 9, Ship_Date: '2025-06-18', Territory: 'North America', Client_Tier: 'Enterprise' },
      { Invoice_ID: 'INV-1018', Hardware_SKU: 'Titan Quantum Accelerator', Item_Family: 'Server Rack', Units_Shipped: 1, Billed_Amount: 780000, Discount_Pct: 0, Ship_Date: '2025-06-27', Territory: 'North America', Client_Tier: 'Government' }, // statistical anomaly
      { Invoice_ID: 'INV-1019', Hardware_SKU: 'EdgeCompute Micro', Item_Family: 'IoT Gateway', Units_Shipped: 140, Billed_Amount: 44800, Discount_Pct: 4, Ship_Date: '2025-07-08', Territory: 'EMEA', Client_Tier: 'SMB' },
      { Invoice_ID: 'INV-1020', Hardware_SKU: 'ThinkStation P620', Item_Family: 'Workstation', Units_Shipped: 28, Billed_Amount: 92400, Discount_Pct: 6, Ship_Date: '2025-07-20', Territory: 'North America', Client_Tier: 'Enterprise' },
      { Invoice_ID: 'INV-1021', Hardware_SKU: 'UltraView 34C', Item_Family: 'Display', Units_Shipped: 110, Billed_Amount: 77000, Discount_Pct: 15, Ship_Date: '2025-08-04', Territory: 'APAC', Client_Tier: 'Commercial' },
      { Invoice_ID: 'INV-1022', Hardware_SKU: 'TensorNode A100', Item_Family: 'Server Rack', Units_Shipped: 7, Billed_Amount: 210000, Discount_Pct: 2, Ship_Date: '2025-08-19', Territory: 'EMEA', Client_Tier: 'Enterprise' },
      { Invoice_ID: 'INV-1023', Hardware_SKU: 'BladePro X16', Item_Family: 'Laptop', Units_Shipped: 45, Billed_Amount: 103500, Discount_Pct: 7, Ship_Date: '2025-09-02', Territory: 'LATAM', Client_Tier: 'SMB' },
      { Invoice_ID: 'INV-1024', Hardware_SKU: 'CyberShield Firewall 10G', Item_Family: 'Networking', Units_Shipped: 32, Billed_Amount: 76800, Discount_Pct: 6, Ship_Date: '2025-09-17', Territory: 'North America', Client_Tier: 'Commercial' },
      { Invoice_ID: 'INV-1025', Hardware_SKU: 'EdgeCompute Micro', Item_Family: 'IoT Gateway', Units_Shipped: 95, Billed_Amount: 30400, Discount_Pct: 3, Ship_Date: '2025-10-05', Territory: 'APAC', Client_Tier: 'SMB' },
      { Invoice_ID: 'INV-1026', Hardware_SKU: 'ThinkStation P620', Item_Family: 'Workstation', Units_Shipped: 19, Billed_Amount: 62700, Discount_Pct: 4, Ship_Date: '2025-10-21', Territory: 'EMEA', Client_Tier: 'Enterprise' },
      { Invoice_ID: 'INV-1027', Hardware_SKU: 'TensorNode A100', Item_Family: 'Server Rack', Units_Shipped: 10, Billed_Amount: 300000, Discount_Pct: 3, Ship_Date: '2025-11-09', Territory: 'North America', Client_Tier: 'Enterprise' },
      { Invoice_ID: 'INV-1028', Hardware_SKU: 'BladePro X16', Item_Family: 'Laptop', Units_Shipped: 58, Billed_Amount: 133400, Discount_Pct: 10, Ship_Date: '2025-11-25', Territory: 'EMEA', Client_Tier: 'Commercial' },
      { Invoice_ID: 'INV-1029', Hardware_SKU: 'UltraView 34C', Item_Family: 'Display', Units_Shipped: 85, Billed_Amount: 59500, Discount_Pct: 8, Ship_Date: '2025-12-08', Territory: 'North America', Client_Tier: 'Enterprise' },
      { Invoice_ID: 'INV-1030', Hardware_SKU: 'CyberShield Firewall 10G', Item_Family: 'Networking', Units_Shipped: 22, Billed_Amount: 52800, Discount_Pct: 5, Ship_Date: '2025-12-20', Territory: 'LATAM', Client_Tier: 'SMB' }
    ]
  },
  {
    id: 'demo-supermarket-pos',
    name: 'Urban Fresh Supermarket PoS',
    fileName: 'supermarket_checkout_pos.xlsx',
    tag: 'Retail PoS',
    description: 'Point-of-sale checkout lines with grocery items, departments, volumes in kilograms, line totals, cashier codes, and store branches.',
    records: [
      { Receipt_Number: 'REC-8801', Grocery_Item: 'Organic Hass Avocado', Department: 'Produce', Volume_Kg: 3.4, Line_Total: 18.70, Cashier_Code: 'CSH-09', Purchase_Timestamp: '2026-02-01 08:32', Store_Branch: 'Downtown Central', Payment_Method: 'Digital UPI' },
      { Receipt_Number: 'REC-8802', Grocery_Item: 'Artisan Sourdough Loaf', Department: 'Bakery', Volume_Kg: 1.2, Line_Total: 8.40, Cashier_Code: 'CSH-14', Purchase_Timestamp: '2026-02-01 09:15', Store_Branch: 'Westside Plaza', Payment_Method: 'Credit Card' },
      { Receipt_Number: 'REC-8803', Grocery_Item: 'Grass-fed Ribeye Steak', Department: 'Meat & Seafood', Volume_Kg: 2.8, Line_Total: 72.80, Cashier_Code: 'CSH-09', Purchase_Timestamp: '2026-02-02 11:45', Store_Branch: 'Downtown Central', Payment_Method: 'Credit Card' },
      { Receipt_Number: 'REC-8804', Grocery_Item: 'Almond Breeze Milk', Department: 'Dairy & Plant', Volume_Kg: 4.0, Line_Total: 14.00, Cashier_Code: 'CSH-22', Purchase_Timestamp: '2026-02-02 14:10', Store_Branch: 'Metro Hub', Payment_Method: 'Apple Pay' },
      { Receipt_Number: 'REC-8805', Grocery_Item: 'Cold Pressed Orange Juice', Department: 'Beverages', Volume_Kg: 2.5, Line_Total: 16.25, Cashier_Code: 'CSH-07', Purchase_Timestamp: '2026-02-03 16:30', Store_Branch: 'Airport Express', Payment_Method: 'Cash' },
      { Receipt_Number: 'REC-8806', Grocery_Item: 'Norwegian Wild Salmon', Department: 'Meat & Seafood', Volume_Kg: 3.1, Line_Total: 86.80, Cashier_Code: 'CSH-14', Purchase_Timestamp: '2026-02-04 12:20', Store_Branch: 'Westside Plaza', Payment_Method: 'Credit Card' },
      { Receipt_Number: 'REC-8807', Grocery_Item: 'Honeycrisp Apples', Department: 'Produce', Volume_Kg: 5.2, Line_Total: 20.80, Cashier_Code: 'CSH-22', Purchase_Timestamp: '2026-02-04 17:55', Store_Branch: 'Metro Hub', Payment_Method: 'Digital UPI' },
      { Receipt_Number: 'REC-8808', Grocery_Item: 'Greek Plain Yogurt 1kg', Department: 'Dairy & Plant', Volume_Kg: 3.0, Line_Total: 15.00, Cashier_Code: 'CSH-09', Purchase_Timestamp: '2026-02-05 10:40', Store_Branch: 'Downtown Central', Payment_Method: 'Apple Pay' },
      { Receipt_Number: 'REC-8809', Grocery_Item: 'Vintage Caviar Reserve', Department: 'Meat & Seafood', Volume_Kg: 0.5, Line_Total: 495.00, Cashier_Code: 'CSH-09', Purchase_Timestamp: '2026-02-06 19:10', Store_Branch: 'Downtown Central', Payment_Method: 'Credit Card' }, // anomaly item
      { Receipt_Number: 'REC-8810', Grocery_Item: 'Organic Hass Avocado', Department: 'Produce', Volume_Kg: 4.6, Line_Total: 25.30, Cashier_Code: 'CSH-07', Purchase_Timestamp: '2026-02-07 09:50', Store_Branch: 'Airport Express', Payment_Method: 'Credit Card' },
      { Receipt_Number: 'REC-8811', Grocery_Item: 'Croissant Butter Pack', Department: 'Bakery', Volume_Kg: 1.5, Line_Total: 9.75, Cashier_Code: 'CSH-14', Purchase_Timestamp: '2026-02-08 11:15', Store_Branch: 'Westside Plaza', Payment_Method: 'Cash' },
      { Receipt_Number: 'REC-8812', Grocery_Item: 'Cold Pressed Orange Juice', Department: 'Beverages', Volume_Kg: 3.5, Line_Total: 22.75, Cashier_Code: 'CSH-22', Purchase_Timestamp: '2026-02-09 13:40', Store_Branch: 'Metro Hub', Payment_Method: 'Digital UPI' },
      { Receipt_Number: 'REC-8813', Grocery_Item: 'Grass-fed Ribeye Steak', Department: 'Meat & Seafood', Volume_Kg: 4.2, Line_Total: 109.20, Cashier_Code: 'CSH-09', Purchase_Timestamp: '2026-02-10 18:20', Store_Branch: 'Downtown Central', Payment_Method: 'Credit Card' },
      { Receipt_Number: 'REC-8814', Grocery_Item: 'Almond Breeze Milk', Department: 'Dairy & Plant', Volume_Kg: 6.0, Line_Total: 21.00, Cashier_Code: 'CSH-14', Purchase_Timestamp: '2026-02-11 15:30', Store_Branch: 'Westside Plaza', Payment_Method: 'Apple Pay' },
      { Receipt_Number: 'REC-8815', Grocery_Item: 'Honeycrisp Apples', Department: 'Produce', Volume_Kg: 6.8, Line_Total: 27.20, Cashier_Code: 'CSH-07', Purchase_Timestamp: '2026-02-12 10:10', Store_Branch: 'Airport Express', Payment_Method: 'Digital UPI' },
      { Receipt_Number: 'REC-8816', Grocery_Item: 'Norwegian Wild Salmon', Department: 'Meat & Seafood', Volume_Kg: 2.4, Line_Total: 67.20, Cashier_Code: 'CSH-22', Purchase_Timestamp: '2026-02-13 14:45', Store_Branch: 'Metro Hub', Payment_Method: 'Credit Card' },
      { Receipt_Number: 'REC-8817', Grocery_Item: 'Artisan Sourdough Loaf', Department: 'Bakery', Volume_Kg: 2.0, Line_Total: 14.00, Cashier_Code: 'CSH-09', Purchase_Timestamp: '2026-02-14 08:50', Store_Branch: 'Downtown Central', Payment_Method: 'Cash' },
      { Receipt_Number: 'REC-8818', Grocery_Item: 'Sparkling Mineral Water', Department: 'Beverages', Volume_Kg: 8.0, Line_Total: 16.00, Cashier_Code: 'CSH-14', Purchase_Timestamp: '2026-02-15 16:15', Store_Branch: 'Westside Plaza', Payment_Method: 'Apple Pay' },
      { Receipt_Number: 'REC-8819', Grocery_Item: 'Greek Plain Yogurt 1kg', Department: 'Dairy & Plant', Volume_Kg: 4.5, Line_Total: 22.50, Cashier_Code: 'CSH-07', Purchase_Timestamp: '2026-02-16 12:30', Store_Branch: 'Airport Express', Payment_Method: 'Digital UPI' },
      { Receipt_Number: 'REC-8820', Grocery_Item: 'Organic Hass Avocado', Department: 'Produce', Volume_Kg: 5.8, Line_Total: 31.90, Cashier_Code: 'CSH-22', Purchase_Timestamp: '2026-02-17 17:05', Store_Branch: 'Metro Hub', Payment_Method: 'Credit Card' }
    ]
  },
  {
    id: 'demo-saas-subscriptions',
    name: 'Nimbus Cloud SaaS Subscriptions',
    fileName: 'saas_recurring_contracts.csv',
    tag: 'Cloud & B2B SaaS',
    description: 'B2B subscription telemetry tracking plan tiers, active seats, monthly recurring fees, renewal dates, and usage frequency bands.',
    records: [
      { Subscription_Key: 'SUB-901', Plan_Name: 'Enterprise Shield', Active_Seats: 450, Monthly_Recurring_Fee: 6750, Billing_Cycle: 'Annual', Renewal_Date: '2026-11-15', Account_Region: 'Americas East', Usage_Band: 'High Velocity' },
      { Subscription_Key: 'SUB-902', Plan_Name: 'Growth Team', Active_Seats: 65, Monthly_Recurring_Fee: 975, Billing_Cycle: 'Monthly', Renewal_Date: '2026-04-10', Account_Region: 'EMEA Central', Usage_Band: 'Moderate' },
      { Subscription_Key: 'SUB-903', Plan_Name: 'Enterprise Shield', Active_Seats: 820, Monthly_Recurring_Fee: 12300, Billing_Cycle: 'Annual', Renewal_Date: '2026-08-22', Account_Region: 'Asia Pacific', Usage_Band: 'High Velocity' },
      { Subscription_Key: 'SUB-904', Plan_Name: 'Starter Core', Active_Seats: 12, Monthly_Recurring_Fee: 180, Billing_Cycle: 'Monthly', Renewal_Date: '2026-03-30', Account_Region: 'Americas West', Usage_Band: 'Low' },
      { Subscription_Key: 'SUB-905', Plan_Name: 'Scale Accelerator', Active_Seats: 210, Monthly_Recurring_Fee: 3150, Billing_Cycle: 'Annual', Renewal_Date: '2026-09-05', Account_Region: 'EMEA Central', Usage_Band: 'High Velocity' },
      { Subscription_Key: 'SUB-906', Plan_Name: 'Growth Team', Active_Seats: 85, Monthly_Recurring_Fee: 1275, Billing_Cycle: 'Monthly', Renewal_Date: '2026-05-18', Account_Region: 'Americas East', Usage_Band: 'Moderate' },
      { Subscription_Key: 'SUB-907', Plan_Name: 'Scale Accelerator', Active_Seats: 190, Monthly_Recurring_Fee: 2850, Billing_Cycle: 'Annual', Renewal_Date: '2026-10-12', Account_Region: 'Asia Pacific', Usage_Band: 'Moderate' },
      { Subscription_Key: 'SUB-908', Plan_Name: 'MegaCorp Sovereign Dedicated', Active_Seats: 4200, Monthly_Recurring_Fee: 78000, Billing_Cycle: 'Multi-Year', Renewal_Date: '2027-01-01', Account_Region: 'Americas East', Usage_Band: 'High Velocity' }, // statistical anomaly
      { Subscription_Key: 'SUB-909', Plan_Name: 'Starter Core', Active_Seats: 15, Monthly_Recurring_Fee: 225, Billing_Cycle: 'Monthly', Renewal_Date: '2026-04-02', Account_Region: 'Americas West', Usage_Band: 'Low' },
      { Subscription_Key: 'SUB-910', Plan_Name: 'Enterprise Shield', Active_Seats: 620, Monthly_Recurring_Fee: 9300, Billing_Cycle: 'Annual', Renewal_Date: '2026-12-01', Account_Region: 'EMEA Central', Usage_Band: 'High Velocity' },
      { Subscription_Key: 'SUB-911', Plan_Name: 'Growth Team', Active_Seats: 70, Monthly_Recurring_Fee: 1050, Billing_Cycle: 'Annual', Renewal_Date: '2026-07-14', Account_Region: 'Asia Pacific', Usage_Band: 'Moderate' },
      { Subscription_Key: 'SUB-912', Plan_Name: 'Scale Accelerator', Active_Seats: 260, Monthly_Recurring_Fee: 3900, Billing_Cycle: 'Monthly', Renewal_Date: '2026-05-20', Account_Region: 'Americas East', Usage_Band: 'High Velocity' },
      { Subscription_Key: 'SUB-913', Plan_Name: 'Starter Core', Active_Seats: 8, Monthly_Recurring_Fee: 120, Billing_Cycle: 'Monthly', Renewal_Date: '2026-03-25', Account_Region: 'EMEA Central', Usage_Band: 'Low' },
      { Subscription_Key: 'SUB-914', Plan_Name: 'Enterprise Shield', Active_Seats: 540, Monthly_Recurring_Fee: 8100, Billing_Cycle: 'Annual', Renewal_Date: '2026-10-30', Account_Region: 'Americas West', Usage_Band: 'High Velocity' },
      { Subscription_Key: 'SUB-915', Plan_Name: 'Growth Team', Active_Seats: 95, Monthly_Recurring_Fee: 1425, Billing_Cycle: 'Monthly', Renewal_Date: '2026-06-08', Account_Region: 'Americas East', Usage_Band: 'Moderate' }
    ]
  }
];
