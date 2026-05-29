from django.db import models


class Company(models.Model):
    name = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class DataSource(models.Model):
    SOURCE_CHOICES = [
        ('SAP', 'SAP'),
        ('UTILITY', 'UTILITY'),
        ('TRAVEL', 'TRAVEL'),
    ]

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    source_type = models.CharField(max_length=20, choices=SOURCE_CHOICES)
    file = models.FileField(upload_to='uploads/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.source_type


class EmissionRecord(models.Model):
    STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('approved', 'Approved'),
    ('rejected', 'Rejected'),
]
    SCOPE_CHOICES = [
    ('SCOPE1', 'Scope 1'),
    ('SCOPE2', 'Scope 2'),
    ('SCOPE3', 'Scope 3'),
]

    data_source = models.ForeignKey(DataSource, on_delete=models.CASCADE)
    plant = models.CharField(max_length=100)
    fuel = models.CharField(max_length=100)
    quantity = models.FloatField()
    unit = models.CharField(max_length=20)

    normalized_quantity = models.FloatField(null=True, blank=True)
    normalized_unit = models.CharField(
    max_length=20,
    default='L'
)

    status = models.CharField(
    max_length=20,
    choices=STATUS_CHOICES,
    default='pending'
)
    scope = models.CharField(
    max_length=20,
    choices=SCOPE_CHOICES,
    default='SCOPE1'
)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    edited = models.BooleanField(default=False)

    def __str__(self):
        return self.fuel