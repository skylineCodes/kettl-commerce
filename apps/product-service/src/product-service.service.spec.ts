import { Test, TestingModule } from '@nestjs/testing';
import { ProductServiceService } from './product-service.service';
import { ProductServiceDocument } from './models/product-service.schema';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductServiceRepository } from './product-service.repository';
import { DynamicPricingDto } from './dto/discount-product-dto';

// Mock product object
export const mockProduct = {
  products: [
    {
      name: 'Smartphone X',
      description: 'Latest model with advanced features',
      slug: 'smartphone-x',
      price: 999.99,
      discountedPrice: 899.99,
      currency: 'USD',
      stockQuantity: 50,
      sku: 'SPX12345',
      availabilityStatus: 'In Stock',
      categories: ['Electronics', 'Mobile Phones'],
      tags: ['smartphone', 'latest', 'android'],
      brand: 'TechBrand',
      product_model: 'X2021',
      colors: ['Black', 'White'],
      sizes: ['64GB', '128GB'],
      weight: 0.174,
      dimensions: { length: 15.7, width: 7.6, height: 0.8 },
      product_images: [
        'https://images.pexels.com/photos/6802049/pexels-photo-6802049.jpeg?auto=compress&cs=tinysrgb&w=600',
        'https://images.pexels.com/photos/3392232/pexels-photo-3392232.jpeg?auto=compress&cs=tinysrgb&w=600',
      ],
      videos: [
        'https://videos.pexels.com/video-files/3627321/3627321-hd_1080_2048_25fps.mp4',
      ],
      thumbnails: [
        'https://images.pexels.com/photos/1394641/pexels-photo-1394641.jpeg?auto=compress&cs=tinysrgb&w=600',
      ],
      manufacturer: 'TechBrand Inc.',
      warranty: '2 Years',
      countryOfOrigin: 'USA',
      ratings: 4.5,
    },
  ],
};

export const updateProduct = {
  name: 'Smartphone Y',
  description: 'Latest model with advanced features',
  slug: 'smartphone-x',
  price: 999.99,
  discountedPrice: 899.99,
  currency: 'USD',
  stockQuantity: 50,
  sku: 'SPX12345',
  availabilityStatus: 'In Stock',
  categories: ['Electronics', 'Mobile Phones'],
  tags: ['smartphone', 'latest', 'android'],
  brand: 'TechBrand',
  product_model: 'X2021',
  colors: ['Black', 'White'],
  sizes: ['64GB', '128GB'],
  weight: 2.174,
  dimensions: {
    length: 15.7,
    width: 7.6,
    height: 0.8,
  },
  images: [
    'https://images.pexels.com/photos/6802049/pexels-photo-6802049.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/3392232/pexels-photo-3392232.jpeg?auto=compress&cs=tinysrgb&w=600',
  ],
  videos: [
    'https://videos.pexels.com/video-files/3627321/3627321-hd_1080_2048_25fps.mp4',
  ],
  thumbnails: [
    'https://images.pexels.com/photos/1394641/pexels-photo-1394641.jpeg?auto=compress&cs=tinysrgb&w=600',
  ],
  manufacturer: 'TechBrand Inc.',
  warranty: '2 Years',
  countryOfOrigin: 'USA',
  ratings: 4.5,
};

export const allProducts = [
  {
    _id: '6670480403afdd4527e3b670',
    name: 'Smartphone X',
    description: 'Latest model with advanced features',
    slug: 'smartphone-x',
    price: 999.99,
    currency: 'USD',
    stockQuantity: 50,
    sku: 'SPX12345',
    availabilityStatus: 'In Stock',
    categories: ['Electronics', 'Mobile Phones'],
    tags: ['smartphone', 'latest', 'android'],
    brand: 'TechBrand',
    product_model: 'X2021',
    colors: ['Black', 'White'],
    sizes: ['64GB', '128GB'],
    weight: 0.174,
    dimensions: {
      length: 15.7,
      width: 7.6,
      height: 0.8,
      _id: '6670480403afdd4527e3b67a',
    },
    product_images: [
      'https://images.pexels.com/photos/6802049/pexels-photo-6802049.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/3392232/pexels-photo-3392232.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    videos: [
      'https://videos.pexels.com/video-files/3627321/3627321-hd_1080_2048_25fps.mp4',
    ],
    thumbnails: [
      'https://images.pexels.com/photos/1394641/pexels-photo-1394641.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    manufacturer: 'TechBrand Inc.',
    warranty: '2 Years',
    countryOfOrigin: 'USA',
    ratings: 4.5,
    relatedProducts: [],
    reviews: [],
    __v: 0,
  },
  {
    _id: '6670480403afdd4527e3b671',
    name: 'Gaming Laptop Pro',
    description: 'High performance gaming laptop',
    slug: 'gaming-laptop-pro',
    price: 1999.99,
    currency: 'USD',
    stockQuantity: 30,
    sku: 'GLP12345',
    availabilityStatus: 'In Stock',
    categories: ['Electronics', 'Computers'],
    tags: ['gaming', 'laptop', 'high-performance'],
    brand: 'GameTech',
    product_model: 'GLP2021',
    colors: ['Black'],
    sizes: ['15.6-inch'],
    weight: 2.5,
    dimensions: {
      length: 38,
      width: 25.5,
      height: 2.5,
      _id: '6670480403afdd4527e3b67b',
    },
    product_images: [
      'https://images.pexels.com/photos/19012059/pexels-photo-19012059/free-photo-of-a-gaming-laptop-and-headphones.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/3951449/pexels-photo-3951449.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    videos: [
      'https://videos.pexels.com/video-files/15114969/15114969-hd_1280_720_25fps.mp4',
    ],
    thumbnails: [
      'https://images.pexels.com/photos/15838208/pexels-photo-15838208/free-photo-of-close-up-of-gaming-desk.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    manufacturer: 'GameTech Co.',
    warranty: '3 Years',
    countryOfOrigin: 'Taiwan',
    ratings: 4.7,
    relatedProducts: [],
    reviews: [],
    __v: 0,
  },
  {
    _id: '6670480403afdd4527e3b672',
    name: 'Wireless Earbuds',
    description: 'Noise-cancelling wireless earbuds',
    slug: 'wireless-earbuds',
    price: 199.99,
    currency: 'USD',
    stockQuantity: 200,
    sku: 'WE12345',
    availabilityStatus: 'In Stock',
    categories: ['Electronics', 'Audio'],
    tags: ['wireless', 'earbuds', 'noise-cancelling'],
    brand: 'SoundWave',
    product_model: 'WE2021',
    colors: ['White', 'Black'],
    sizes: [],
    weight: 0.05,
    dimensions: {
      length: 6,
      width: 5,
      height: 2.5,
      _id: '6670480403afdd4527e3b67c',
    },
    product_images: [
      'https://images.pexels.com/photos/8534088/pexels-photo-8534088.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/10029870/pexels-photo-10029870.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    videos: [
      'https://videos.pexels.com/video-files/7710285/7710285-hd_720_1366_25fps.mp4',
    ],
    thumbnails: [
      'https://images.pexels.com/photos/10029870/pexels-photo-10029870.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    manufacturer: 'SoundWave Ltd.',
    warranty: '1 Year',
    countryOfOrigin: 'China',
    ratings: 4.3,
    relatedProducts: [],
    reviews: [],
    __v: 0,
  },
  {
    _id: '6670480403afdd4527e3b673',
    name: 'Smartwatch Series 6',
    description: 'Advanced smartwatch with health monitoring',
    slug: 'smartwatch-series-6',
    price: 399.99,
    currency: 'USD',
    stockQuantity: 80,
    sku: 'SS612345',
    availabilityStatus: 'In Stock',
    categories: ['Electronics', 'Wearables'],
    tags: ['smartwatch', 'health', 'fitness'],
    brand: 'WristTech',
    product_model: 'WS62021',
    colors: ['Silver', 'Black'],
    sizes: ['40mm', '44mm'],
    weight: 0.1,
    dimensions: {
      length: 4.4,
      width: 3.8,
      height: 1.1,
      _id: '6670480403afdd4527e3b67d',
    },
    product_images: [
      'https://images.pexels.com/photos/437036/pexels-photo-437036.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/3927389/pexels-photo-3927389.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    videos: [
      'https://videos.pexels.com/video-files/8027978/8027978-hd_720_1366_25fps.mp4',
    ],
    thumbnails: [
      'https://images.pexels.com/photos/437036/pexels-photo-437036.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    manufacturer: 'WristTech Co.',
    warranty: '1 Year',
    countryOfOrigin: 'USA',
    ratings: 4.8,
    relatedProducts: [],
    reviews: [],
    __v: 0,
  },
  {
    _id: '6670480403afdd4527e3b674',
    name: '4K UHD TV',
    description: 'Ultra high definition 4K television',
    slug: '4k-uhd-tv',
    price: 1299.99,
    currency: 'USD',
    stockQuantity: 25,
    sku: 'TV412345',
    availabilityStatus: 'In Stock',
    categories: ['Electronics', 'Home Entertainment'],
    tags: ['4K', 'UHD', 'television'],
    brand: 'ViewMax',
    product_model: 'VM412021',
    colors: ['Black'],
    sizes: ['55-inch', '65-inch'],
    weight: 18,
    dimensions: {
      length: 123,
      width: 75,
      height: 10,
      _id: '6670480403afdd4527e3b67e',
    },
    product_images: [
      'https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    videos: [
      'https://videos.pexels.com/video-files/7239171/7239171-hd_1280_720_50fps.mp4',
    ],
    thumbnails: [
      'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    manufacturer: 'ViewMax Corp.',
    warranty: '2 Years',
    countryOfOrigin: 'Japan',
    ratings: 4.6,
    relatedProducts: [],
    reviews: [],
    __v: 0,
  },
  {
    _id: '6670480403afdd4527e3b675',
    name: 'Bluetooth Speaker',
    description: 'Portable Bluetooth speaker with deep bass',
    slug: 'bluetooth-speaker',
    price: 99.99,
    currency: 'USD',
    stockQuantity: 150,
    sku: 'BS12345',
    availabilityStatus: 'In Stock',
    categories: ['Electronics', 'Audio'],
    tags: ['bluetooth', 'speaker', 'portable'],
    brand: 'SoundWave',
    product_model: 'BS2021',
    colors: ['Red', 'Blue', 'Black'],
    sizes: [],
    weight: 0.5,
    dimensions: {
      length: 10,
      width: 10,
      height: 10,
      _id: '6670480503afdd4527e3b67f',
    },
    product_images: [
      'https://images.pexels.com/photos/1279365/pexels-photo-1279365.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/6332446/pexels-photo-6332446.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    videos: [
      'https://videos.pexels.com/video-files/4799811/4799811-sd_540_960_30fps.mp4',
    ],
    thumbnails: [
      'https://images.pexels.com/photos/20071323/pexels-photo-20071323/free-photo-of-bluetooth-speaker-with-lamp.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    manufacturer: 'SoundWave Ltd.',
    warranty: '1 Year',
    countryOfOrigin: 'China',
    ratings: 4.4,
    relatedProducts: [],
    reviews: [],
    __v: 0,
  },
  {
    _id: '6670480403afdd4527e3b676',
    name: 'Digital Camera',
    description: 'High resolution digital camera for photography enthusiasts',
    slug: 'digital-camera',
    price: 499.99,
    currency: 'USD',
    stockQuantity: 40,
    sku: 'DC12345',
    availabilityStatus: 'In Stock',
    categories: ['Electronics', 'Cameras'],
    tags: ['digital', 'camera', 'photography'],
    brand: 'PhotoPro',
    product_model: 'PP2021',
    colors: ['Black'],
    sizes: [],
    weight: 1.2,
    dimensions: {
      length: 15,
      width: 10,
      height: 8,
      _id: '6670480503afdd4527e3b680',
    },
    product_images: [
      'https://images.pexels.com/photos/593324/pexels-photo-593324.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2873486/pexels-photo-2873486.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    videos: [
      'https://videos.pexels.com/video-files/2317031/2317031-sd_640_360_30fps.mp4',
    ],
    thumbnails: [
      'https://images.pexels.com/photos/1528851/pexels-photo-1528851.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    manufacturer: 'PhotoPro Inc.',
    warranty: '1 Year',
    countryOfOrigin: 'Germany',
    ratings: 4.5,
    relatedProducts: [],
    reviews: [],
    __v: 0,
  },
  {
    _id: '6670480403afdd4527e3b677',
    name: 'Electric Kettle',
    description: 'Fast boiling electric kettle with auto shut-off',
    slug: 'electric-kettle',
    price: 49.99,
    currency: 'USD',
    stockQuantity: 100,
    sku: 'EK12345',
    availabilityStatus: 'In Stock',
    categories: ['Home Appliances', 'Kitchen'],
    tags: ['electric', 'kettle', 'kitchen'],
    brand: 'HomeEase',
    product_model: 'HE2021',
    colors: ['White', 'Black'],
    sizes: [],
    weight: 1,
    dimensions: {
      length: 20,
      width: 15,
      height: 25,
      _id: '6670480503afdd4527e3b681',
    },
    product_images: [
      'https://images.pexels.com/photos/5903820/pexels-photo-5903820.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/8330316/pexels-photo-8330316.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/7176006/pexels-photo-7176006.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    videos: [
      'https://videos.pexels.com/video-files/7214677/7214677-sd_540_960_25fps.mp4',
    ],
    thumbnails: [
      'https://images.pexels.com/photos/7176006/pexels-photo-7176006.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    manufacturer: 'HomeEase Co.',
    warranty: '1 Year',
    countryOfOrigin: 'China',
    ratings: 4.2,
    relatedProducts: [],
    reviews: [],
    __v: 0,
  },
  {
    _id: '6670480403afdd4527e3b678',
    name: 'Air Purifier',
    description: 'HEPA air purifier for clean indoor air',
    slug: 'air-purifier',
    price: 149.99,
    currency: 'USD',
    stockQuantity: 60,
    sku: 'AP12345',
    availabilityStatus: 'In Stock',
    categories: ['Home Appliances', 'Health'],
    tags: ['air purifier', 'HEPA', 'clean air'],
    brand: 'PureAir',
    product_model: 'PA2021',
    colors: ['White'],
    sizes: [],
    weight: 4.5,
    dimensions: {
      length: 30,
      width: 20,
      height: 40,
      _id: '6670480503afdd4527e3b682',
    },
    product_images: [
      'https://images.pexels.com/photos/20502967/pexels-photo-20502967/free-photo-of-air-purifier-and-vase-of-flowers.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/6681848/pexels-photo-6681848.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/7795761/pexels-photo-7795761.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    videos: [
      'https://videos.pexels.com/video-files/6541159/6541159-sd_540_960_25fps.mp4',
    ],
    thumbnails: [
      'https://images.pexels.com/photos/7795761/pexels-photo-7795761.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    manufacturer: 'PureAir Corp.',
    warranty: '2 Years',
    countryOfOrigin: 'South Korea',
    ratings: 4.7,
    relatedProducts: [],
    reviews: [],
    __v: 0,
  },
  {
    _id: '6670480403afdd4527e3b679',
    name: 'Fitness Tracker',
    description: 'Wearable fitness tracker with heart rate monitor',
    slug: 'fitness-tracker',
    price: 69.99,
    currency: 'USD',
    stockQuantity: 120,
    sku: 'FT12345',
    availabilityStatus: 'In Stock',
    categories: ['Electronics', 'Wearables'],
    tags: ['fitness', 'tracker', 'wearable'],
    brand: 'FitLife',
    product_model: 'FL2021',
    colors: ['Black', 'Blue', 'Pink'],
    sizes: [],
    weight: 0.03,
    dimensions: {
      length: 4,
      width: 2,
      height: 1,
      _id: '6670480503afdd4527e3b683',
    },
    product_images: [
      'https://images.pexels.com/photos/7746517/pexels-photo-7746517.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/4429141/pexels-photo-4429141.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/17543777/pexels-photo-17543777/free-photo-of-a-smartphone-displaying-charts-on-a-fitness-tracker-app.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    videos: [
      'https://videos.pexels.com/video-files/3943118/3943118-sd_640_338_25fps.mp4',
    ],
    thumbnails: [
      'https://images.pexels.com/photos/17543777/pexels-photo-17543777/free-photo-of-a-smartphone-displaying-charts-on-a-fitness-tracker-app.jpeg?auto=compress&cs=tinysrgb&w=600',
    ],
    manufacturer: 'FitLife Inc.',
    warranty: '1 Year',
    countryOfOrigin: 'USA',
    ratings: 4.3,
    relatedProducts: [],
    reviews: [],
    __v: 0,
  },
];

export const singleProduct = {
  _id: '6670480403afdd4527e3b674',
  name: '4K UHD TV',
  description: 'Ultra high definition 4K television',
  slug: '4k-uhd-tv',
  price: 1000,
  discountedPrice: 900,
  currency: 'USD',
  stockQuantity: 25,
  sku: 'TV412345',
  availabilityStatus: 'In Stock',
  categories: ['Electronics', 'Home Entertainment'],
  tags: ['4K', 'UHD', 'television'],
  brand: 'ViewMax',
  product_model: 'VM412021',
  colors: ['Black'],
  sizes: ['55-inch', '65-inch'],
  weight: 18,
  dimensions: {
    length: 123,
    width: 75,
    height: 10,
    _id: '6670480403afdd4527e3b67e',
  },
  product_images: [
    'https://images.pexels.com/photos/1444416/pexels-photo-1444416.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/4009402/pexels-photo-4009402.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=600',
  ],
  videos: [
    'https://videos.pexels.com/video-files/7239171/7239171-hd_1280_720_50fps.mp4',
  ],
  thumbnails: [
    'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=600',
  ],
  manufacturer: 'ViewMax Corp.',
  warranty: '2 Years',
  countryOfOrigin: 'Japan',
  ratings: 4.6,
  relatedProducts: [],
  reviews: [],
  __v: 0,
};

describe('ProductServiceService', () => {
  let service: ProductServiceService;
  let repository: ProductServiceRepository;
  let model: Model<ProductServiceDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductServiceService,
        ProductServiceRepository,
        {
          provide: getModelToken(ProductServiceDocument.name),
          useValue: {
            new: jest.fn().mockResolvedValue(mockProduct),
            constructor: jest.fn().mockResolvedValue(mockProduct),
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            insertMany: jest.fn(),
            findOneAndUpdate: jest.fn(),
            findOneAndDelete: jest.fn(),
            exec: jest.fn(),
            save: jest.fn()
          },
        },
      ],
    }).compile();

    service = module.get<ProductServiceService>(ProductServiceService);
    model = module.get<Model<ProductServiceDocument>>(
      getModelToken(ProductServiceDocument.name),
    );
    repository = module.get<ProductServiceRepository>(ProductServiceRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('insertMany', () => {
    it('should create an array of products', async () => {
      const productDto: any = mockProduct;
      const result = {
        status: 201,
        message: 'Products created successfully!',
      };

      jest.spyOn(repository, 'insertMany').mockResolvedValue(result as any);

      expect(await service.create(productDto.products)).toEqual(result);
    })
  });
  
  describe('findAll', () => {
    it('should fetch an array of products', async () => {
      const queryParams = {
        page: 1,
        pageSize: 5
      }

      const { page, pageSize } = queryParams;

      const totalItems = 10;
      const totalPages = Math.ceil(totalItems / pageSize);

      const result = {
        status: 200,
        message: 'Products retrieved successfully',
        data: allProducts,
        page,
        pageSize,
        totalPages,
        totalItems,
        _links: {
          self: {
            href: `/product-service?page=${page}&pageSize=${pageSize}`,
          },
          next:
            page < totalPages
              ? {
                  href: `/product-service?page=${page + 1}&pageSize=${pageSize}`,
                }
              : null,
          prev:
            page > 1
              ? {
                  href: `/product-service?page=${page - 1}&pageSize=${pageSize}`,
                }
              : null,
          first: {
            href: `/product-service?page=1&pageSize=${pageSize}`,
          },
          last: {
            href: `/product-service?page=${totalPages}&pageSize=${pageSize}`,
          },
        },
      };

      jest.spyOn(repository, 'paginatedFind').mockResolvedValue(allProducts as any);

      expect(await service.findAll(queryParams)).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should find a product by id', async () => {
      const result = { status: 200, data: singleProduct };
      jest.spyOn(repository, 'findOne').mockResolvedValue(singleProduct as any);

      expect(await service.findOne('6670480403afdd4527e3b674')).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update a product by id', async () => {
      const result = {
        status: 200,
        message: 'Products updated successfully',
      };
      jest.spyOn(repository, 'findOneAndUpdate').mockResolvedValue(singleProduct as any);

      expect(await service.update('6670480403afdd4527e3b674', updateProduct)).toEqual(result);
    })
  });
  
  describe('delete', () => {
    it('should removed a product by id', async () => {
      const result = {
        status: 200,
        message: 'Product deleted successfully!',
      };
      jest.spyOn(repository, 'findOneAndDelete').mockResolvedValue(singleProduct as any);

      expect(await service.remove('6670480403afdd4527e3b674')).toEqual(result);
    })
  });

  describe('checkStockAvailability', () => {
    it('should check if a product stock is available', async () => {
      const result = true;

      jest.spyOn(repository, 'findOne').mockResolvedValue(singleProduct as any);

      expect(
        await service.checkStockAvailability('6670480403afdd4527e3b674', 10),
      ).toEqual(result);
    });
  });

  describe('reduceStockQuantity', () => {
    it('should reduce the stock quantity', async () => {
      const result = {
        status: 200,
        message: 'Product stock count updated successfully!',
      };

      const saveProduct = {
        ...singleProduct,
        save: jest.fn().mockResolvedValue(true),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(saveProduct as any);

      expect(
        await service.reduceStockQuantity('6670480403afdd4527e3b674', 10),
      ).toEqual(result);
      expect(saveProduct.stockQuantity).toBe(15);
      expect(saveProduct.save).toHaveBeenCalled();
    });
  });

  describe('applyDiscount', () => {
    it('should apply a discount to the product price', async () => {
      const saveProduct = {
        ...singleProduct,
        save: jest.fn().mockResolvedValue(true),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(saveProduct as any);

      const result = await service.applyDiscount(
        '6670480403afdd4527e3b674',
        10,
      );

      expect(result).toEqual({
        status: 200,
        message: 'Product price updated successfully!',
      });
      expect(saveProduct.discountedPrice).toBe(900);
      expect(saveProduct.save).toHaveBeenCalled();
    });
  });

  describe('removeDiscount', () => {
    it('should remove discount from a product', async () => {
      const result = {
        status: 200,
        message: 'Product price updated successfully!',
      };

      const saveProduct = {
        ...singleProduct,
        save: jest.fn().mockResolvedValue(true),
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(saveProduct as any);

      expect(
        await service.removeDiscount('6670480403afdd4527e3b674'),
      ).toEqual(result);
      expect(saveProduct.discountedPrice).toBe(undefined);
      expect(saveProduct.save).toHaveBeenCalled();
    });
  });

  describe('applyDynamicPricing', () => {
    it('should apply combined dynamic pricing factors', async () => {
      const product = {
        ...singleProduct,
        price: 1000,
        save: jest.fn().mockResolvedValue(true),
      };

      const pricingDto: DynamicPricingDto = {
        demandFactor: 1.5,
        timeOfDay: '10-18',
        customerSegments: ['VIP'],
      };

      const mockDate = new Date(2023, 6, 25, 12, 0, 0); // During the specified time of day
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      jest.spyOn(repository, 'findOne').mockResolvedValue(product as any);

      const result = await service.applyDynamicPricing(
        '6670480403afdd4527e3b674',
        pricingDto,
      );

      expect(product.price).toBeCloseTo(1282.5, 2); // 1000 * 1.5 * 0.9 * 0.95
      expect(product.save).toHaveBeenCalled();
      expect(result).toEqual({
        status: 200,
        message: 'Product price updated successfully!',
      });
    });

    it('should apply only demand factor pricing', async () => {
      const saveProduct = {
        ...singleProduct,
        price: 1000,
        save: jest.fn().mockResolvedValue(true),
      };

      const pricingDto: DynamicPricingDto = {
        demandFactor: 1.5,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(saveProduct as any);

      const result = await service.applyDynamicPricing(
        '6670480403afdd4527e3b674',
        pricingDto,
      );

      expect(saveProduct.price).toBeCloseTo(1500, 2); // 1000 * 1.5
      expect(saveProduct.save).toHaveBeenCalled();
      expect(result).toEqual({
        status: 200,
        message: 'Product price updated successfully!',
      });
    });

    it('should apply time of day discount', async () => {
      const saveProduct = {
        ...singleProduct,
        price: 1000,
        save: jest.fn().mockResolvedValue(true),
      };

      const pricingDto: DynamicPricingDto = {
        timeOfDay: '10-18',
      };
      
      const mockDate = new Date(2023, 6, 25, 12, 0, 0); // During the specified time of day

      console.log(mockDate);
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate as any);

      jest.spyOn(repository, 'findOne').mockResolvedValue(saveProduct as any);

      const result = await service.applyDynamicPricing(
        '6670480403afdd4527e3b674',
        pricingDto,
      );

      // Check if the discount is applied correctly
      const expectedPrice = 900; // 10% discount
      expect(saveProduct.price).toBeCloseTo(expectedPrice, 2);
      expect(saveProduct.save).toHaveBeenCalled();
      expect(result).toEqual({
        status: 200,
        message: 'Product price updated successfully!',
      });
    });

    it('should apply VIP customer discount', async () => {
      const saveProduct = {
        ...singleProduct,
        price: 1000,
        save: jest.fn().mockResolvedValue(true),
      };

      const pricingDto: DynamicPricingDto = {
        customerSegments: ['VIP'],
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(saveProduct as any);

      const result = await service.applyDynamicPricing(
        '6670480403afdd4527e3b674',
        pricingDto,
      );

      expect(saveProduct.price).toBeCloseTo(950, 2); // 1000 * 0.95
      expect(saveProduct.save).toHaveBeenCalled();
      expect(result).toEqual({
        status: 200,
        message: 'Product price updated successfully!',
      });
    });
  });
});
