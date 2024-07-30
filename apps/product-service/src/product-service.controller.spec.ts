import { Test, TestingModule } from '@nestjs/testing';
import { ProductServiceController } from './product-service.controller';
import { ProductServiceService } from './product-service.service';
import { CreateProductServiceDto } from './dto/create-product-service.dto';
import { allProducts, mockProduct, singleProduct, updateProduct } from './product-service.service.spec';
import { UpdateProductServiceDto } from './dto/update-product-service.dto';

describe('ProductServiceController', () => {
  let controller: ProductServiceController;
  let service: ProductServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductServiceController],
      providers: [
        {
          provide: ProductServiceService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductServiceController>(ProductServiceController);
    service = module.get<ProductServiceService>(ProductServiceService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a product', async () => {
      const dto: CreateProductServiceDto = mockProduct;
      const result = { status: 201, message: 'Products created successfully!' };

      jest.spyOn(service, 'create').mockResolvedValue(result);

      expect(await controller.create(dto)).toBe(result);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result = {
        status: 200,
        message: 'Products retrieved successfully!',
        data: allProducts,
      };

      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const result = {
        status: 200,
        data: singleProduct,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await controller.findOne('6670480403afdd4527e3b674')).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith('6670480403afdd4527e3b674');
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const dto: UpdateProductServiceDto = updateProduct;
      const result = {
        status: 200,
        message: 'Products updated successfully'
      }

      jest.spyOn(service, 'update').mockResolvedValue(result);

      expect(await controller.update('6670480403afdd4527e3b674', dto)).toBe(result);
      expect(service.update).toHaveBeenCalledWith('6670480403afdd4527e3b674', dto);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const result = {
        status: 200,
        message: 'Product deleted successfully!'
      }

      jest.spyOn(service, 'remove').mockResolvedValue(result);

      expect(await controller.remove('6670480403afdd4527e3b674')).toBe(result);
      expect(service.remove).toHaveBeenCalledWith('6670480403afdd4527e3b674');
    })
  })
});
