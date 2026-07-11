from enum import Enum


class UserRole(str, Enum):
    GUEST = "guest"
    MEMBER = "member"
    STORE_OWNER = "store_owner"
    RIDER = "rider"
    ADMIN = "admin"


class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class PaymentStatus(str, Enum):
    UNPAID = "unpaid"
    PAID = "paid"
    REFUNDED = "refunded"


class ContainerStatus(str, Enum):
    ISSUED = "issued"          # 발급됨, 사용자 보유중
    IN_USE = "in_use"          # 매장에서 사용중
    RETURNED = "returned"      # 수거함에 반납됨
    COLLECTED = "collected"    # 라이더가 수거 완료
    WASHED = "washed"          # 세척 완료, 재사용 가능
    LOST = "lost"


class ContainerEventType(str, Enum):
    ISSUED = "issued"
    RETURNED = "returned"
    COLLECTED = "collected"
    WASHED = "washed"
    LOST = "lost"


class CollectionPointStatus(str, Enum):
    NORMAL = "normal"
    NEAR_FULL = "near_full"
    FULL = "full"


class PickupTaskStatus(str, Enum):
    OPEN = "open"
    ACCEPTED = "accepted"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class RewardType(str, Enum):
    ORDER_BONUS = "order_bonus"
    RETURN_BONUS = "return_bonus"
    PICKUP_INCENTIVE = "pickup_incentive"
    REFUND = "refund"


class RewardStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CLAIMED = "claimed"
    CANCELLED = "cancelled"


class ErrorCode(str, Enum):
    VALIDATION_ERROR = "VALIDATION_ERROR"
    NOT_FOUND = "NOT_FOUND"
    UNAUTHORIZED = "UNAUTHORIZED"
    FORBIDDEN = "FORBIDDEN"
    CONFLICT = "CONFLICT"
    INTERNAL_ERROR = "INTERNAL_ERROR"
